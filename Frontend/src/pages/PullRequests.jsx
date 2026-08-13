import React, { useState, useEffect } from 'react'
import { pullRequestApi } from "../api/pullRequestApi.js"
import { PRListTable } from "../features/pullRequests/components/PRListTable.jsx"
import { Pagination } from "../components/common/Pagination.jsx"
import { Spinner } from "../components/common/Spinner.jsx"
import { ErrorMessage } from "../components/common/ErrorMessage.jsx"

const PullRequests = () => {
    const [pullRequests, setPullRequests] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPRs = async (currentPage) => {
        try {
            setLoading(true);
            setError(null);
            const data = await pullRequestApi.getPullRequests({ page: currentPage, limit: 10 });
            setPullRequests(Array.isArray(data) ? data : data.pullRequests || data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message || "Failed to load pull request scans.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPRs(page);
    }, [page]);
    return (
        <div>PullRequests</div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Pull Request Audits</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Review automated security scan reports and security grades across pull requests.
                </p>
            </div>

            <ErrorMessage message={error} onRetry={() => fetchPRs(page)} />

            {loading ? (
                <div className="py-12 flex justify-center">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="space-y-4">
                    <PRListTable pullRequests={pullRequests} />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            )}
        </div>
    );
}

export default PullRequests