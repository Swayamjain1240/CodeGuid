import React from "react";
import { GitPullRequest, ExternalLink, Calendar } from "lucide-react";
import { SecurityGradeBadge } from "./SecurityGradeBadge.jsx";
import { formData } from "../../../utils/formatData.js";

export const PRSummaryCard = ({ pr }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">#{pr?.number || pr?.prNumber}</span>
              <h2 className="text-xl font-bold text-slate-100">{pr?.title || "Pull Request Audit"}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Repository: <span className="text-slate-200 font-medium">{pr?.repositoryName || pr?.repo || "Connected Repo"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SecurityGradeBadge grade={pr?.securityGrade || pr?.grade} className="px-3 py-1 text-sm" />
          {pr?.htmlUrl && (
            <a
              href={pr.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="View on GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Scanned: {formatDate(pr?.createdAt || pr?.scannedAt)}</span>
        </div>
        <div>
          Status: <span className="text-slate-200 capitalize font-medium">{pr?.status || "Completed"}</span>
        </div>
      </div>
    </div>
  );
};