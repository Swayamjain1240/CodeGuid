import { z } from "zod";

// Canonical vocabulary shared by the prompt, the validator, MongoDB and the dashboard.
export const SEVERITY_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
export const SECURITY_GRADES = ["A", "B", "C", "D", "F"];

const DEFAULT_SEVERITY = "MEDIUM";
const UNKNOWN_FILE_PATH = "unknown";

// Accepts both the current field names and the legacy ones emitted by older prompts
// or the experimental Python service (file/line/title).
const rawFindingSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  severity: z.unknown().optional(),
  filePath: z.string().optional(),
  file: z.string().optional(),
  lineNumber: z.union([z.number(), z.string(), z.null()]).optional(),
  line: z.union([z.number(), z.string(), z.null()]).optional(),
  description: z.string().optional(),
  recommendation: z.string().optional(),
  suggestedFix: z.string().optional(),
  owaspCategory: z.string().optional(),
});

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

export const normalizeSeverity = (value) => {
  const raw = normalizeText(value).toUpperCase();

  if (SEVERITY_LEVELS.includes(raw)) return raw;
  if (raw === "INFO" || raw === "INFORMATIONAL") return "LOW";

  // Unknown severities are treated conservatively instead of being silently
  // downgraded to LOW, which would hide a potentially serious finding.
  return DEFAULT_SEVERITY;
};

export const normalizeGrade = (value) => {
  const raw = normalizeText(value).toUpperCase();
  return SECURITY_GRADES.includes(raw) ? raw : null;
};

const normalizeLineNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return Math.trunc(parsed);
  }

  return null;
};

export const normalizeFinding = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const parsed = rawFindingSchema.safeParse(raw);
  if (!parsed.success) return null;

  const finding = parsed.data;
  const type = normalizeText(finding.type) || normalizeText(finding.title) || "Unspecified issue";
  const filePath = normalizeText(finding.filePath) || normalizeText(finding.file) || UNKNOWN_FILE_PATH;

  return {
    type,
    severity: normalizeSeverity(finding.severity),
    owaspCategory: normalizeText(finding.owaspCategory) || undefined,
    filePath,
    lineNumber: normalizeLineNumber(finding.lineNumber ?? finding.line),
    description: normalizeText(finding.description) || "No description provided.",
    recommendation:
      normalizeText(finding.recommendation) || normalizeText(finding.suggestedFix) || "",
  };
};

export const deriveGradeFromFindings = (vulnerabilities = []) => {
  const severities = new Set(vulnerabilities.map((vulnerability) => vulnerability.severity));

  if (severities.has("CRITICAL")) return "F";
  if (severities.has("HIGH")) return "D";
  if (severities.has("MEDIUM")) return "C";
  if (severities.has("LOW")) return "B";

  return "A";
};

export const normalizeAnalysis = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("AI response was not a JSON object");
  }

  // Fail closed: a response without a findings array cannot be distinguished from a
  // genuinely clean scan, so it is rejected instead of being persisted as PASSED.
  if (!Array.isArray(raw.vulnerabilities)) {
    throw new Error("AI response did not contain a vulnerabilities array");
  }

  const vulnerabilities = raw.vulnerabilities.map((rawFinding, index) => {
    const finding = normalizeFinding(rawFinding);

    // Never drop a finding silently: one malformed entry invalidates the analysis.
    if (!finding) {
      throw new Error(`AI response contained an invalid finding at index ${index}`);
    }

    return finding;
  });

  const providedGrade = normalizeGrade(raw.securityGrade);
  const securityGrade = providedGrade || deriveGradeFromFindings(vulnerabilities);

  return {
    securityGrade,
    // Status is derived from the validated findings so it can never disagree with
    // the stored vulnerability list.
    status: vulnerabilities.length > 0 ? "FAILED" : "PASSED",
    summary: normalizeText(raw.summary) || "No summary provided.",
    vulnerabilities,
  };
};

export const parseAnalysisPayload = (text) => {
  const cleaned = String(text ?? "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  if (!cleaned) throw new Error("AI response was empty");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  return normalizeAnalysis(parsed);
};

// Storage adapter: MongoDB keeps `type` as the canonical field and `title` as an
// optional legacy alias so older readers and documents still work.
export const toPersistedFinding = (finding = {}) => ({
  type: finding.type,
  title: finding.type,
  severity: finding.severity,
  owaspCategory: finding.owaspCategory,
  filePath: finding.filePath,
  lineNumber: finding.lineNumber ?? undefined,
  description: finding.description,
  recommendation: finding.recommendation,
});
