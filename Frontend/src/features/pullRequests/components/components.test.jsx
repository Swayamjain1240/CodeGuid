import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { SecurityGradeBadge } from "./SecurityGradeBadge.jsx";
import { PRListTable } from "./PRListTable.jsx";
import { PRSummaryCard } from "./PRSummaryCard.jsx";
import { VulnerabilityCard } from "./VulnerabilityCard.jsx";

const pr = {
  _id: "65f000000000000000000001",
  prNumber: 12,
  title: "Add search endpoint",
  status: "FAILED",
  securityGrade: "D",
  createdAt: "2026-01-15T10:30:00.000Z",
  repository: { name: "api", fullName: "acme/api", htmlUrl: "https://github.com/acme/api" },
  vulnerabilities: [
    {
      type: "Command Injection",
      severity: "HIGH",
      filePath: "src/search.js",
      lineNumber: 8,
      description: "Shell command built from request input.",
      recommendation: "Use execFile with an allowlist.",
    },
  ],
};

describe("pull request components", () => {
  it("renders the security grade badge for a graded scan", () => {
    render(<SecurityGradeBadge grade="F" className="px-3" />);

    expect(screen.getByText("Grade F")).toBeInTheDocument();
  });

  it("renders the PR list with repository and a formatted date", () => {
    render(
      <MemoryRouter>
        <PRListTable pullRequests={[pr]} />
      </MemoryRouter>
    );

    expect(screen.getByText("Add search endpoint")).toBeInTheDocument();
    expect(screen.getByText("acme/api")).toBeInTheDocument();
    expect(screen.getByText(/Jan 1[45], 2026/)).toBeInTheDocument();
    expect(screen.getByText("1 Issues")).toBeInTheDocument();
  });

  it("renders the summary card with the repository and a working GitHub link", () => {
    render(
      <MemoryRouter>
        <PRSummaryCard pr={pr} />
      </MemoryRouter>
    );

    expect(screen.getByText("acme/api")).toBeInTheDocument();
    expect(screen.getByTitle("View on GitHub")).toHaveAttribute(
      "href",
      "https://github.com/acme/api/pull/12"
    );
  });

  it("renders a persisted finding using the canonical fields", () => {
    render(<VulnerabilityCard issue={pr.vulnerabilities[0]} />);

    expect(screen.getByText("Command Injection")).toBeInTheDocument();
    expect(screen.getByText("src/search.js")).toBeInTheDocument();
    expect(screen.getByText("(Line 8)")).toBeInTheDocument();
    expect(screen.getByText(/Use execFile with an allowlist\./)).toBeInTheDocument();
  });
});
