export const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
export const GRADES = ["A", "B", "C", "D", "F"];

const GRADE_POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };

const toCount = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const averageGradeFromDistribution = (gradeDistribution) => {
  const gradedTotal = GRADES.reduce((sum, grade) => sum + gradeDistribution[grade], 0);
  if (gradedTotal === 0) return null;

  const points =
    GRADES.reduce((sum, grade) => sum + gradeDistribution[grade] * GRADE_POINTS[grade], 0) /
    gradedTotal;

  const index = Math.min(GRADES.length - 1, Math.max(0, 4 - Math.round(points)));
  return GRADES[index];
};

export const buildDashboardPayload = ({
  counts = {},
  severityCounts = {},
  gradeCounts = {},
  recentScans = [],
} = {}) => {
  const totalPRs = toCount(counts.totalPRs);
  const passedPRs = toCount(counts.passedPRs);
  const passRate = totalPRs > 0 ? Number(((passedPRs / totalPRs) * 100).toFixed(1)) : 100;

  const vulnerabilities = Object.fromEntries(
    SEVERITIES.map((severity) => [severity, toCount(severityCounts?.[severity])])
  );
  const vulnerabilityTotal = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);

  const gradeDistribution = Object.fromEntries(
    GRADES.map((grade) => [grade, toCount(gradeCounts?.[grade])])
  );

  return {
    overview: {
      totalRepos: toCount(counts.totalRepos),
      totalPRs,
      passedPRs,
      failedPRs: toCount(counts.failedPRs),
      scanningPRs: toCount(counts.scanningPRs),
      passRate,
    },
    vulnerabilities,
    vulnerabilityTotal,
    gradeDistribution,
    averageGrade: averageGradeFromDistribution(gradeDistribution),
    recentScans,
  };
};
