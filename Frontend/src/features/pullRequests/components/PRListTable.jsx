import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GitPullRequest } from "lucide-react";
import { Table } from "../../../components/common/Table.jsx";
import { SecurityGradeBadge } from "./SecurityGradeBadge.jsx";
import { formData  } from "../../../utils/formatData.js";

export const PRListTable = ({ pullRequests = [] }) => {
  const headers = ["PR Title", "Repository", "Grade", "Vulnerabilities", "Scanned At", "Action"];

  return (
    <Table headers={headers} emptyMessage="No pull request scans found.">
      {pullRequests.map((pr) => {
        const id = pr._id || pr.id;
        const vulnLength = pr.vulnerabilities?.length || pr.issuesCount || 0;

        return (
          <tr key={id} className="hover:bg-slate-800/40 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-100 flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate max-w-xs">{pr.title}</span>
            </td>
            <td className="px-6 py-4 text-slate-400">{pr.repositoryName || pr.repo}</td>
            <td className="px-6 py-4">
              <SecurityGradeBadge grade={pr.securityGrade || pr.grade} />
            </td>
            <td className="px-6 py-4 text-slate-300">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${vulnLength > 0 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                {vulnLength} Issues
              </span>
            </td>
            <td className="px-6 py-4 text-slate-400">{formatDate(pr.createdAt || pr.scannedAt)}</td>
            <td className="px-6 py-4">
              <Link
                to={`/pull-requests/${id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};