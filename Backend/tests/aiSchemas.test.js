import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import PullRequest from "../models/pullRequestModel.js";
import {
  deriveGradeFromFindings,
  normalizeAnalysis,
  parseAnalysisPayload,
  toPersistedFinding,
} from "../services/aiSchemas.js";

// The exact shape requested by the prompt in Backend/services/aiService.js.
const aiFixture = {
  securityGrade: "F",
  status: "FAILED",
  summary: "SQL injection found in the user lookup.",
  vulnerabilities: [
    {
      severity: "critical",
      type: "SQL Injection",
      filePath: "src/db.js",
      lineNumber: "42",
      description: "Query built from unescaped user input.",
      recommendation: "Use parameterized queries.",
      unexpectedField: "must be dropped",
    },
  ],
};

const buildPullRequestDoc = (analysis) =>
  new PullRequest({
    repository: new mongoose.Types.ObjectId(),
    prNumber: 7,
    title: "Add user lookup",
    commitSha: "abc123",
    author: "dev",
    status: analysis.status,
    securityGrade: analysis.securityGrade,
    vulnerabilities: analysis.vulnerabilities.map(toPersistedFinding),
  });

test("AI output can be persisted without validation errors (regression: missing title)", async () => {
  const analysis = normalizeAnalysis(aiFixture);
  const doc = buildPullRequestDoc(analysis);

  await assert.doesNotReject(() => doc.validate());

  assert.equal(doc.vulnerabilities.length, 1);
  assert.equal(doc.vulnerabilities[0].type, "SQL Injection");
  assert.equal(doc.vulnerabilities[0].title, "SQL Injection");
  assert.equal(doc.vulnerabilities[0].severity, "CRITICAL");
  assert.equal(doc.vulnerabilities[0].lineNumber, 42);
  assert.equal(doc.vulnerabilities[0].unexpectedField, undefined);
});

test("severity is normalized to the canonical enum", () => {
  const analysis = normalizeAnalysis({
    vulnerabilities: [
      { type: "A", severity: "High", filePath: "a.js", description: "d" },
      { type: "B", severity: "info", filePath: "b.js", description: "d" },
      { type: "C", severity: "whatever", filePath: "c.js", description: "d" },
    ],
  });

  assert.deepEqual(
    analysis.vulnerabilities.map((finding) => finding.severity),
    ["HIGH", "LOW", "MEDIUM"]
  );
});

test("legacy field names from older clients are mapped", () => {
  const analysis = normalizeAnalysis({
    vulnerabilities: [{ title: "Hardcoded secret", file: "config.js", line: "12", description: "key" }],
  });

  assert.equal(analysis.vulnerabilities[0].type, "Hardcoded secret");
  assert.equal(analysis.vulnerabilities[0].filePath, "config.js");
  assert.equal(analysis.vulnerabilities[0].lineNumber, 12);
});

test("invalid severity grade falls back to a grade derived from findings", () => {
  assert.equal(deriveGradeFromFindings([{ severity: "CRITICAL" }]), "F");
  assert.equal(deriveGradeFromFindings([{ severity: "HIGH" }]), "D");
  assert.equal(deriveGradeFromFindings([{ severity: "MEDIUM" }]), "C");
  assert.equal(deriveGradeFromFindings([{ severity: "LOW" }]), "B");
  assert.equal(deriveGradeFromFindings([]), "A");

  const analysis = normalizeAnalysis({ securityGrade: "Z", vulnerabilities: [{ severity: "HIGH", type: "XSS", filePath: "x.js", description: "d" }] });
  assert.equal(analysis.securityGrade, "D");
});

test("status is derived from validated findings and never contradicts them", () => {
  const clean = normalizeAnalysis({ securityGrade: "F", status: "FAILED", vulnerabilities: [] });
  assert.equal(clean.status, "PASSED");
  assert.equal(clean.vulnerabilities.length, 0);

  const found = normalizeAnalysis({ securityGrade: "A", status: "PASSED", vulnerabilities: aiFixture.vulnerabilities });
  assert.equal(found.status, "FAILED");
});

test("findings without a file path or description still persist safely", async () => {
  const analysis = normalizeAnalysis({
    vulnerabilities: [{ severity: "LOW", type: "Minor issue" }],
  });

  assert.equal(analysis.vulnerabilities[0].filePath, "unknown");
  assert.equal(analysis.vulnerabilities[0].description, "No description provided.");

  const doc = buildPullRequestDoc(analysis);
  await assert.doesNotReject(() => doc.validate());
});

test("fenced JSON from the provider is parsed, malformed JSON is rejected", () => {
  const parsed = parseAnalysisPayload("```json\n" + JSON.stringify(aiFixture) + "\n```");
  assert.equal(parsed.vulnerabilities.length, 1);

  assert.throws(() => parseAnalysisPayload("not json"), /not valid JSON/);
  assert.throws(() => parseAnalysisPayload(""), /was empty/);
  assert.throws(() => normalizeAnalysis([1, 2]), /not a JSON object/);
});

test("a missing vulnerabilities property is rejected instead of treated as clean", () => {
  assert.throws(
    () => normalizeAnalysis({ securityGrade: "A", summary: "No issues found." }),
    /did not contain a vulnerabilities array/
  );

  assert.throws(
    () => parseAnalysisPayload(JSON.stringify({ securityGrade: "A", summary: "No issues found." })),
    /did not contain a vulnerabilities array/
  );
});

test("a non-array vulnerabilities value is rejected", () => {
  assert.throws(
    () => normalizeAnalysis({ securityGrade: "F", vulnerabilities: "SQL injection in db.js" }),
    /did not contain a vulnerabilities array/
  );

  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: { type: "SQL Injection" } }),
    /did not contain a vulnerabilities array/
  );

  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: null }),
    /did not contain a vulnerabilities array/
  );
});

test("malformed finding elements fail the whole analysis instead of being dropped", () => {
  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: ["SQL injection in db.js"] }),
    /invalid finding at index 0/
  );

  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: [42] }),
    /invalid finding at index 0/
  );

  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: [null] }),
    /invalid finding at index 0/
  );

  assert.throws(
    () => normalizeAnalysis({ vulnerabilities: [[{ type: "SQL Injection" }]] }),
    /invalid finding at index 0/
  );
});

test("a valid finding followed by a malformed element rejects the whole analysis", () => {
  assert.throws(
    () =>
      normalizeAnalysis({
        vulnerabilities: [aiFixture.vulnerabilities[0], 42],
      }),
    /invalid finding at index 1/
  );
});

test("a finding with a non-string type is rejected instead of being discarded", () => {
  assert.throws(
    () =>
      normalizeAnalysis({
        vulnerabilities: [{ type: 123, severity: "CRITICAL", filePath: "a.js", description: "d" }],
      }),
    /invalid finding at index 0/
  );

  assert.throws(
    () =>
      normalizeAnalysis({
        vulnerabilities: [{ title: { nested: true }, severity: "CRITICAL", filePath: "a.js", description: "d" }],
      }),
    /invalid finding at index 0/
  );
});

test("a valid empty vulnerabilities array is a legitimate clean result", async () => {
  const analysis = normalizeAnalysis({ securityGrade: "A", summary: "No issues found.", vulnerabilities: [] });

  assert.equal(analysis.status, "PASSED");
  assert.equal(analysis.securityGrade, "A");
  assert.deepEqual(analysis.vulnerabilities, []);

  const doc = buildPullRequestDoc(analysis);
  await assert.doesNotReject(() => doc.validate());
});

test("a valid canonical finding survives normalization and persistence", async () => {
  const analysis = normalizeAnalysis(aiFixture);
  const doc = buildPullRequestDoc(analysis);

  await assert.doesNotReject(() => doc.validate());

  assert.equal(analysis.status, "FAILED");
  assert.equal(analysis.securityGrade, "F");
  assert.equal(analysis.vulnerabilities[0].type, "SQL Injection");
  assert.equal(analysis.vulnerabilities[0].filePath, "src/db.js");
  assert.equal(analysis.vulnerabilities[0].lineNumber, 42);
  assert.equal(doc.vulnerabilities[0].type, "SQL Injection");
});
