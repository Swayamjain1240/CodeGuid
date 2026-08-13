import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { pullRequestApi } from '../api/pullRequestApi.js';
import { Spinner } from '../components/common/Spinner.jsx';
import { ArrowLeft, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { PRSummaryCard } from "../features/pullRequests/components/PRSummaryCard.jsx"
import { VulnerabilityCard } from "../features/pullRequests/components/VulnerabilityCard.jsx"

export const PullRequestsDetail = () => {

    const { id } = useParams();
    const [pr, setPr] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fetchPRDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await pullRequestApi.getPullRequestById(id);
            setPr(data.pullRequest || data);

        } catch (error) {
            setError(error.message || "Failed to load pull request audit details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPRDetails();
    }, [id]);

    if (loading) {
        return (
            <div className='py-16 flex justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Navigation Back Link */}
            <Link
                to="/pull-requests"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Pull Requests</span>
            </Link>

            <ErrorMessage message={error} onRetry={fetchPRDetails} />

            {pr && (
                <>
                    <PRSummaryCard pr={pr} />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                            {pr.vulnerabilities?.length > 0 ? (
                                <ShieldAlert className="w-5 h-5 text-rose-400" />
                            ) : (
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            )}
                            <span>Detected Security Findings ({pr.vulnerabilities?.length || 0})</span>
                        </h3>

                        {pr.vulnerabilities && pr.vulnerabilities.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {pr.vulnerabilities.map((issue, idx) => (
                                    <VulnerabilityCard key={issue._id || idx} issue={issue} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-sm">
                                No security vulnerabilities or code smells detected in this pull request.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};