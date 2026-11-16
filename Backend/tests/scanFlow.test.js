import test from "node:test";
import assert from "node:assert/strict";

import { createScanProcessor } from "../services/scanService.js";
import { formatSecurityCommentMarkdown } from "../services/aiService.js";
import { normalizeAnalysis } from "../services/aiSchemas.js";

const silentLogger = { log() {}, error() {} };

const analysisWithFinding = normalizeAnalysis({
  securityGrade: "F",
  summary: "SQL injection found.",
  vulnerabilities: [
    {
      severity: "CRITICAL",
      type: "SQL Injection",
      filePath: "src/db.js",
      lineNumber: 42,
      description: "Unescaped input concatenated into the query.",
      recommendation: "Use parameterized queries.",
    },
  ],
});

const analysisClean = normalizeAnalysis({ securityGrade: "A", summary: "No issues.", vulnerabilities: [] });

const createHarness = ({ analysis, analyzer, token = "test-token", repoDoc = { _id: "repo-1", owner: "user-1" } } = {}) => {
  const scans = new Map();
  const comments = [];
  let idCounter = 1;

  const ensureScan = (id = `scan-${idCounter++}`) => {
    if (!scans.has(id)) scans.set(id, { _id: id });
    return scans.get(id);
  };

  const PullRequest = {
    async findById(id) {
      return scans.get(String(id)) ?? ensureScan(String(id));
    },
    async findOneAndUpdate(filter, update) {
      const existing = [...scans.values()].find((scan) => scan.prNumber === filter.prNumber);
      const doc = existing ?? ensureScan();
      Object.assign(doc, { repository: filter.repository }, update);
      scans.set(doc._id, doc);
      return doc;
    },
    async findByIdAndUpdate(id, update) {
      const doc = ensureScan(String(id));
      Object.assign(doc, update);
      return doc;
    },
  };

  const deps = {
    PullRequest,
    Repository: { async findOne() { return repoDoc; } },
    User: { async findById() { return { githubAccessToken: token }; } },
    fetchPRDiff: async () => "diff --git a/src/db.js b/src/db.js",
    analyzeDiffWithAI:
      analyzer ??
      (async () => {
        if (analysis instanceof Error) throw analysis;
        return analysis;
      }),
    postPRComment: async (...args) => {
      comments.push(args);
      return { id: 1 };
    },
    formatSecurityCommentMarkdown,
    logger: silentLogger,
  };

  return { processor: createScanProcessor(deps), scans, comments };
};

const jobData = {
  prNumber: 5,
  prTitle: "Add user lookup",
  branch: "feature/login",
  baseBranch: "main",
  repoFullName: "acme/api",
  owner: "acme",
  repoName: "api",
  author: "dev",
  commitSha: "abc123",
};

test("PR event data flows through diff fetch, AI analysis, persistence and GitHub comment", async () => {
  const { processor, scans, comments } = createHarness({ analysis: analysisWithFinding });

  const result = await processor(jobData);

  const [scan] = [...scans.values()];
  assert.equal(result.status, "FAILED");
  assert.equal(scan.status, "FAILED");
  assert.equal(scan.securityGrade, "F");
  assert.equal(scan.vulnerabilities.length, 1);
  assert.equal(scan.vulnerabilities[0].type, "SQL Injection");
  assert.equal(scan.vulnerabilities[0].filePath, "src/db.js");
  assert.equal(scan.vulnerabilities[0].lineNumber, 42);
  assert.equal(scan.githubCommentPosted, true);

  assert.equal(comments.length, 1);
  const [, , prNumber, markdown, token] = comments[0];
  assert.equal(prNumber, 5);
  assert.equal(token, "test-token");
  assert.match(markdown, /SQL Injection/);
  assert.match(markdown, /src\/db\.js/);
  assert.match(markdown, /Line 42/);
  assert.match(markdown, /Use parameterized queries/);
});

test("clean diff is stored as PASSED with a grade and an audit comment", async () => {
  const { processor, scans, comments } = createHarness({ analysis: analysisClean });

  const result = await processor(jobData);

  const [scan] = [...scans.values()];
  assert.equal(result.status, "PASSED");
  assert.equal(scan.status, "PASSED");
  assert.equal(scan.securityGrade, "A");
  assert.deepEqual(scan.vulnerabilities, []);
  assert.equal(comments.length, 1);
  assert.match(comments[0][3], /No Security Issues Detected/);
});

test("AI failure marks the scan FAILED and rethrows for BullMQ retries", async () => {
  const { processor, scans } = createHarness({ analysis: new Error("provider unavailable") });

  await assert.rejects(() => processor(jobData), /provider unavailable/);

  const [scan] = [...scans.values()];
  assert.equal(scan.status, "FAILED");
});

test("a job carrying its own GitHub token does not need the user lookup", async () => {
  const { processor, comments } = createHarness({ analysis: analysisClean });

  await processor({ ...jobData, githubAccessToken: "job-token" });

  assert.equal(comments.length, 1);
  assert.equal(comments[0][4], "job-token");
});

test("invalid AI analysis is not persisted as a clean scan, fails the scan and rethrows", async () => {
  const { processor, scans, comments } = createHarness({
    // Mirrors Backend/services/aiService.js: validation runs inside the AI step and
    // its error is wrapped, then propagates to the scan processor.
    analyzer: async () => {
      try {
        return normalizeAnalysis({ securityGrade: "A", summary: "Looks clean." });
      } catch (error) {
        throw new Error(`AI Analysis failed: ${error.message}`);
      }
    },
  });

  await assert.rejects(() => processor(jobData), /vulnerabilities array/);

  const [scan] = [...scans.values()];
  assert.equal(scan.status, "FAILED");
  assert.notEqual(scan.status, "PASSED");
  assert.equal(scan.securityGrade, undefined);
  assert.equal(scan.vulnerabilities, undefined);
  assert.equal(scan.githubCommentPosted, undefined);
  assert.equal(comments.length, 0);
});
