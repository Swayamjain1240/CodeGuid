import PullRequest from "../models/pullRequestModel.js";
import Repository from "../models/repositoryModel.js";
import User from "../models/userModel.js";
import { PR_STATUS } from "../config/constants.js";
import { fetchPRDiff, postPRComment } from "./githubServices.js";
import { analyzeDiffWithAI, formatSecurityCommentMarkdown } from "./aiService.js";
import { toPersistedFinding } from "./aiSchemas.js";

const defaultDependencies = {
  PullRequest,
  Repository,
  User,
  fetchPRDiff,
  postPRComment,
  analyzeDiffWithAI,
  formatSecurityCommentMarkdown,
  logger: console,
};

export const createScanProcessor = (overrides = {}) => {
  const deps = { ...defaultDependencies, ...overrides };

  return async (jobData) => {
    const {
      pullRequestId,
      repoFullName,
      prNumber,
      owner,
      repoName,
      prTitle,
      commitSha,
      author,
      branch,
      baseBranch,
      githubAccessToken: providedToken,
    } = jobData;

    const {
      PullRequest,
      Repository,
      User,
      fetchPRDiff,
      postPRComment,
      analyzeDiffWithAI,
      formatSecurityCommentMarkdown,
      logger,
    } = deps;

    logger.log(`[Worker] Starting security scan for PR #${prNumber} in ${repoFullName}`);

    let prDoc;
    let token = providedToken;

    const repoDoc = await Repository.findOne({ fullName: repoFullName });

    if (!token && repoDoc) {
      const userDoc = await User.findById(repoDoc.owner);
      token = userDoc?.githubAccessToken;
    }

    if (pullRequestId) {
      prDoc = await PullRequest.findById(pullRequestId);
    } else if (repoDoc) {
      prDoc = await PullRequest.findOneAndUpdate(
        { repository: repoDoc._id, prNumber },
        {
          repository: repoDoc._id,
          prNumber,
          title: prTitle || `PR #${prNumber}`,
          commitSha: commitSha || "HEAD",
          author: author || "unknown",
          branch,
          baseBranch,
          status: PR_STATUS.SCANNING,
        },
        { upsert: true, new: true }
      );
    }

    if (prDoc) {
      await PullRequest.findByIdAndUpdate(prDoc._id, { status: PR_STATUS.SCANNING });
    }

    try {
      const [repoOwner, repoOnlyName] = repoFullName.split("/");
      const diffText = await fetchPRDiff(repoOwner, repoOnlyName, prNumber, token);

      const analysisResult = await analyzeDiffWithAI(diffText);

      const vulnerabilities = Array.isArray(analysisResult.vulnerabilities)
        ? analysisResult.vulnerabilities
        : [];
      const finalStatus = vulnerabilities.length > 0 ? PR_STATUS.FAILED : PR_STATUS.PASSED;

      if (prDoc) {
        await PullRequest.findByIdAndUpdate(prDoc._id, {
          status: finalStatus,
          securityGrade: analysisResult.securityGrade,
          vulnerabilities: vulnerabilities.map(toPersistedFinding),
          rawAiResponse: analysisResult.summary,
        });
      }

      if (token) {
        const markdown = formatSecurityCommentMarkdown(analysisResult);
        await postPRComment(repoOwner, repoOnlyName, prNumber, markdown, token);
        if (prDoc) {
          await PullRequest.findByIdAndUpdate(prDoc._id, { githubCommentPosted: true });
        }
      }

      logger.log(`[Worker] Successfully completed scan for PR #${prNumber}`);

      return { status: finalStatus, findings: vulnerabilities.length };
    } catch (error) {
      logger.error(`[Worker Error] Failed scanning PR #${prNumber}:`, error.message);

      if (prDoc) {
        await PullRequest.findByIdAndUpdate(prDoc._id, {
          status: PR_STATUS.FAILED,
        });
      }

      throw error;
    }
  };
};

export const processPullRequestScan = createScanProcessor();
