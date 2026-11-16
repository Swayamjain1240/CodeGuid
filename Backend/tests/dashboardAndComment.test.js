import test from "node:test";
import assert from "node:assert/strict";

import { buildDashboardPayload } from "../services/dashboardService.js";
import { formatSecurityCommentMarkdown } from "../services/aiService.js";
import { normalizeAnalysis } from "../services/aiSchemas.js";

test("dashboard payload exposes every field the UI reads", () => {
  const payload = buildDashboardPayload({
    counts: { totalRepos: 2, totalPRs: 4, passedPRs: 3, failedPRs: 1, scanningPRs: 0 },
    severityCounts: { CRITICAL: 2, HIGH: 1, MEDIUM: 0, LOW: 3, UNKNOWN: 9 },
    gradeCounts: { A: 2, B: 1, C: 0, D: 1, F: 0 },
  });

  assert.deepEqual(payload.overview, {
    totalRepos: 2,
    totalPRs: 4,
    passedPRs: 3,
    failedPRs: 1,
    scanningPRs: 0,
    passRate: 75,
  });
  assert.deepEqual(payload.vulnerabilities, { CRITICAL: 2, HIGH: 1, MEDIUM: 0, LOW: 3 });
  assert.equal(payload.vulnerabilityTotal, 6);
  assert.deepEqual(payload.gradeDistribution, { A: 2, B: 1, C: 0, D: 1, F: 0 });
  assert.equal(payload.averageGrade, "B");
  assert.deepEqual(payload.recentScans, []);
});

test("dashboard handles an empty account without inventing grades", () => {
  const payload = buildDashboardPayload();

  assert.equal(payload.overview.totalPRs, 0);
  assert.equal(payload.vulnerabilityTotal, 0);
  assert.equal(payload.averageGrade, null);
  assert.deepEqual(payload.gradeDistribution, { A: 0, B: 0, C: 0, D: 0, F: 0 });
});

test("PR comment contains grade, summary and canonical finding fields", () => {
  const analysis = normalizeAnalysis({
    securityGrade: "F",
    summary: "Two critical issues.",
    vulnerabilities: [
      {
        severity: "CRITICAL",
        type: "SQL Injection",
        filePath: "src/db.js",
        lineNumber: 42,
        description: "Unescaped input.",
        recommendation: "Parameterize the query.",
      },
    ],
  });

  const markdown = formatSecurityCommentMarkdown(analysis);

  assert.match(markdown, /Grade F/);
  assert.match(markdown, /FAILED/);
  assert.match(markdown, /Two critical issues\./);
  assert.match(markdown, /\[CRITICAL\] SQL Injection/);
  assert.match(markdown, /src\/db\.js/);
  assert.match(markdown, /Line 42/);
  assert.match(markdown, /Parameterize the query\./);
});

test("PR comment renders the no-findings section for a clean scan", () => {
  const markdown = formatSecurityCommentMarkdown(
    normalizeAnalysis({ securityGrade: "A", summary: "Clean.", vulnerabilities: [] })
  );

  assert.match(markdown, /No Security Issues Detected/);
  assert.match(markdown, /Grade A/);
});
