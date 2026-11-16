import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const api = vi.hoisted(() => ({
  getRepositories: vi.fn(),
  syncRepositories: vi.fn(),
  toggleRepoScanning: vi.fn(),
  getMetrics: vi.fn(),
  getPullRequestById: vi.fn(),
  getPullRequests: vi.fn(),
  rescanPullRequest: vi.fn(),
}));

vi.mock("../api/repositoryApi.js", () => ({
  repositoryApi: {
    getRepositories: api.getRepositories,
    syncRepositories: api.syncRepositories,
    toggleRepoScanning: api.toggleRepoScanning,
  },
}));

vi.mock("../api/dashboardApi.js", () => ({
  dashboardApi: { getMetrics: api.getMetrics },
}));

vi.mock("../api/pullRequestApi.js", () => ({
  pullRequestApi: {
    getPullRequestById: api.getPullRequestById,
    getPullRequests: api.getPullRequests,
    rescanPullRequest: api.rescanPullRequest,
  },
}));

import { Dashboard } from "./Dashboard.jsx";
import { Repositories } from "./Repositories.jsx";
import { PullRequestsDetail } from "./PullRequestsDetail.jsx";

describe("pages read the backend envelope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders repositories returned inside the data envelope", async () => {
    api.getRepositories.mockResolvedValue({
      success: true,
      count: 1,
      data: [
        {
          _id: "repo-1",
          name: "api",
          fullName: "acme/api",
          private: false,
          isScanningEnabled: true,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Repositories />
      </MemoryRouter>
    );

    expect(await screen.findByText("api")).toBeInTheDocument();
    expect(screen.getByText("acme/api")).toBeInTheDocument();
  });

  it("renders dashboard metrics from the dashboard DTO", async () => {
    api.getMetrics.mockResolvedValue({
      success: true,
      data: {
        overview: {
          totalRepos: 4,
          totalPRs: 12,
          passedPRs: 9,
          failedPRs: 3,
          scanningPRs: 0,
          passRate: 75,
        },
        vulnerabilities: { CRITICAL: 2, HIGH: 1, MEDIUM: 0, LOW: 4 },
        vulnerabilityTotal: 7,
        gradeDistribution: { A: 3, B: 2, C: 1, D: 1, F: 0 },
        averageGrade: "B",
        recentScans: [],
      },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders findings from the PR detail envelope", async () => {
    api.getPullRequestById.mockResolvedValue({
      success: true,
      data: {
        prNumber: 12,
        title: "Add search endpoint",
        status: "FAILED",
        securityGrade: "D",
        createdAt: "2026-01-15T10:30:00.000Z",
        repository: { fullName: "acme/api", htmlUrl: "https://github.com/acme/api" },
        vulnerabilities: [
          {
            _id: "finding-1",
            type: "Command Injection",
            severity: "HIGH",
            filePath: "src/search.js",
            lineNumber: 8,
            description: "Shell command built from request input.",
            recommendation: "Use execFile with an allowlist.",
          },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={["/pull-requests/65f000000000000000000001"]}>
        <Routes>
          <Route path="/pull-requests/:id" element={<PullRequestsDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Command Injection")).toBeInTheDocument();
    expect(screen.getByText("Detected Security Findings (1)")).toBeInTheDocument();
    expect(screen.getByText("src/search.js")).toBeInTheDocument();
  });
});
