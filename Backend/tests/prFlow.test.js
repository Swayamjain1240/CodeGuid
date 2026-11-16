import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { verifyGithubSig } from "../middlewares/verifyGitHubSignature.js";
import { createWebhookHandler } from "../controllers/webhookController.js";
import { createScanProcessor } from "../services/scanService.js";
import { formatSecurityCommentMarkdown } from "../services/aiService.js";
import { normalizeAnalysis } from "../services/aiSchemas.js";
import { buildDashboardPayload } from "../services/dashboardService.js";

// Test-only secret. No real credentials are used anywhere in these tests.
process.env.GITHUB_WEBHOOK_SECRET = "codeguide_test_webhook_secret";

const silentLogger = { log() {}, error() {} };

const pullRequestPayload = {
  action: "opened",
  pull_request: {
    number: 12,
    title: "Add search endpoint",
    head: { ref: "feature/search", sha: "deadbeef" },
    base: { ref: "main" },
  },
  repository: {
    id: 98765,
    full_name: "acme/api",
    name: "api",
    owner: { login: "acme" },
  },
  sender: { login: "dev" },
};

const rawBody = Buffer.from(JSON.stringify(pullRequestPayload), "utf8");
const signature = "sha256=" + crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET).update(rawBody).digest("hex");

const createResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

const createRequest = (overrides = {}) => ({
  headers: { "x-github-event": "pull_request", "x-hub-signature-256": signature },
  body: pullRequestPayload,
  rawBody,
  ...overrides,
});

const runPipeline = async ({ req, queue, processor }) => {
  const res = createResponse();
  let verified = false;

  verifyGithubSig(req, res, () => {
    verified = true;
  });

  if (!verified) return { res, verified, jobData: null };

  await createWebhookHandler({ queue })(req, res);

  const job = queue.jobs[0];
  if (job) await processor(job.data);

  return { res, verified, jobData: job?.data ?? null };
};

const createFakes = () => {
  const scans = new Map();
  const comments = [];
  let counter = 1;

  const ensure = (id = `scan-${counter++}`) => {
    if (!scans.has(id)) scans.set(id, { _id: id });
    return scans.get(id);
  };

  const queue = {
    jobs: [],
    async add(name, data, options) {
      this.jobs.push({ name, data, options });
      return { id: `job-${this.jobs.length}` };
    },
  };

  const processor = createScanProcessor({
    PullRequest: {
      async findById(id) {
        return scans.get(String(id)) ?? ensure(String(id));
      },
      async findOneAndUpdate(filter, update) {
        const doc = [...scans.values()].find((scan) => scan.prNumber === filter.prNumber) ?? ensure();
        Object.assign(doc, { repository: filter.repository }, update);
        return doc;
      },
      async findByIdAndUpdate(id, update) {
        const doc = ensure(String(id));
        Object.assign(doc, update);
        return doc;
      },
    },
    Repository: { async findOne() { return { _id: "repo-1", owner: "user-1" }; } },
    User: { async findById() { return { githubAccessToken: "test-token" }; } },
    fetchPRDiff: async (owner, repo, prNumber, token) => {
      assert.equal(owner, "acme");
      assert.equal(repo, "api");
      assert.equal(prNumber, 12);
      assert.equal(token, "test-token");
      return "diff --git a/src/search.js b/src/search.js";
    },
    analyzeDiffWithAI: async () =>
      normalizeAnalysis({
        securityGrade: "D",
        summary: "Command injection risk.",
        vulnerabilities: [
          {
            severity: "HIGH",
            type: "Command Injection",
            filePath: "src/search.js",
            lineNumber: 8,
            description: "Shell command built from request input.",
            recommendation: "Use execFile with an allowlist.",
          },
        ],
      }),
    postPRComment: async (...args) => {
      comments.push(args);
      return { id: 99 };
    },
    formatSecurityCommentMarkdown,
    logger: silentLogger,
  });

  return { queue, processor, scans, comments };
};

test("signed PR webhook is verified, queued, scanned, persisted and summarised on the dashboard", async () => {
  const { queue, processor, scans, comments } = createFakes();

  const { res, verified, jobData } = await runPipeline({ req: createRequest(), queue, processor });

  assert.equal(verified, true);
  assert.equal(res.statusCode, 202);
  assert.equal(queue.jobs.length, 1);
  assert.equal(queue.jobs[0].name, "analyze-pr");
  assert.equal(jobData.prNumber, 12);
  assert.equal(jobData.repoFullName, "acme/api");
  assert.equal(jobData.commitSha, "deadbeef");

  const [scan] = [...scans.values()];
  assert.equal(scan.status, "FAILED");
  assert.equal(scan.vulnerabilities[0].type, "Command Injection");
  assert.equal(scan.githubCommentPosted, true);
  assert.equal(comments.length, 1);
  assert.match(comments[0][3], /Command Injection/);

  const dashboard = buildDashboardPayload({
    counts: { totalRepos: 1, totalPRs: 1, passedPRs: 0, failedPRs: 1 },
    severityCounts: { HIGH: 1 },
    gradeCounts: { D: 1 },
    recentScans: [scan],
  });

  assert.equal(dashboard.overview.totalPRs, 1);
  assert.equal(dashboard.overview.passRate, 0);
  assert.equal(dashboard.vulnerabilityTotal, 1);
  assert.equal(dashboard.vulnerabilities.HIGH, 1);
  assert.equal(dashboard.gradeDistribution.D, 1);
  assert.equal(dashboard.averageGrade, "D");
});

test("an invalid signature is rejected and nothing is queued", async () => {
  const { queue, processor } = createFakes();
  const req = createRequest({ headers: { "x-github-event": "pull_request", "x-hub-signature-256": "sha256=" + "0".repeat(64) } });

  const { res, verified } = await runPipeline({ req, queue, processor });

  assert.equal(verified, false);
  assert.equal(res.statusCode, 401);
  assert.equal(queue.jobs.length, 0);
});

test("a missing signature is rejected", async () => {
  const { queue, processor } = createFakes();
  const req = createRequest({ headers: { "x-github-event": "pull_request" } });

  const { res, verified } = await runPipeline({ req, queue, processor });

  assert.equal(verified, false);
  assert.equal(res.statusCode, 401);
  assert.equal(queue.jobs.length, 0);
});

test("unrelated actions and events are acknowledged without queueing work", async () => {
  const { queue, processor } = createFakes();

  const closedPayload = { ...pullRequestPayload, action: "closed" };
  const closedBody = Buffer.from(JSON.stringify(closedPayload), "utf8");
  const closedSignature = "sha256=" + crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET).update(closedBody).digest("hex");

  const { res, verified } = await runPipeline({
    req: createRequest({
      body: closedPayload,
      rawBody: closedBody,
      headers: { "x-github-event": "pull_request", "x-hub-signature-256": closedSignature },
    }),
    queue,
    processor,
  });

  assert.equal(verified, true);
  assert.equal(res.statusCode, 200);
  assert.equal(queue.jobs.length, 0);
});

test("invalid payloads return 400", async () => {
  const { queue, processor } = createFakes();
  const invalidPayload = { action: "opened", repository: null, pull_request: null, sender: null };
  const invalidBody = Buffer.from(JSON.stringify(invalidPayload), "utf8");
  const invalidSignature = "sha256=" + crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET).update(invalidBody).digest("hex");

  const res = createResponse();
  await createWebhookHandler({ queue })(
    createRequest({
      body: invalidPayload,
      rawBody: invalidBody,
      headers: { "x-github-event": "pull_request", "x-hub-signature-256": invalidSignature },
    }),
    res
  );

  assert.equal(res.statusCode, 400);
  assert.equal(queue.jobs.length, 0);
});
