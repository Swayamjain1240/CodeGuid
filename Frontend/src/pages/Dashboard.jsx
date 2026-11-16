import React, { useEffect, useState } from 'react'
import { FolderGit2, GitPullRequest, ShieldAlert, ShieldCheck } from "lucide-react"
import { dashboardApi } from "../api/dashboardApi.js"
import { getData } from "../api/response.js"
import { MetricCard } from "../features/dashboard/components/MetricCard.jsx"
import { GradeDistributionCard } from "../features/dashboard/components/GradeDistributionCard.jsx"
import { Spinner } from "../components/common/Spinner.jsx"
import { ErrorMessage } from "../components/common/ErrorMessage.jsx"

export const Dashboard = () => {

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dashboardApi.getMetrics();
      setMetrics(getData(data) ?? null);
    } catch (error) {
      setError(error.message || " Failed to load dashboard metrics. ")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const overview = metrics?.overview ?? {};
  const severity = metrics?.vulnerabilities ?? {};
  const vulnerabilityTotal = metrics?.vulnerabilityTotal
    ?? Object.values(severity).reduce((sum, count) => sum + (Number(count) || 0), 0);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Security Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          High-level overview of connected repositories, pull request audits, and security ratings.
        </p>
      </div>

      <ErrorMessage message={error} onRetry={fetchDashboardStats} />

      {metrics && (
        <>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Connected Repositories"
              value={overview.totalRepos ?? 0}
              subtext="Repositories synced"
              icon={FolderGit2}
              color="cyan"
            />
            <MetricCard
              title="Scanned Pull Requests"
              value={overview.totalPRs ?? 0}
              subtext="Audited PRs"
              icon={GitPullRequest}
              color="emerald"
            />
            <MetricCard
              title="Open Vulnerabilities"
              value={vulnerabilityTotal}
              subtext="Issues found"
              icon={ShieldAlert}
              color="rose"
            />
            <MetricCard
              title="Average Security Grade"
              value={metrics.averageGrade ?? "—"}
              subtext="Overall codebase health"
              icon={ShieldCheck}
              color="amber"
            />
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GradeDistributionCard grades={metrics.gradeDistribution ?? {}} />

            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100 mb-2">Automated Audit Protection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  GitGuard actively monitors your synced repositories. Whenever a new pull request is opened or updated on GitHub, an automated security audit runs instantly to assess potential vulnerabilities.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-xs mt-4">
                💡 <strong className="text-cyan-300">Pro-Tip:</strong> Enable "Automatic Security Scan" on your repositories under the Repositories page to keep your pull requests protected automatically.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
