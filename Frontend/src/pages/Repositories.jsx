import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { repositoryApi } from "../api/repositoryApi.js"
import { filterRepositories } from "../features/repositories/repositoryUtils.js"
import { RepoList } from "../features/repositories/components/RepoList.jsx"
import { RepoSyncButton } from "../features/repositories/components/RepoSyncButton.jsx"
import { ErrorMessage } from "../components/common/ErrorMessage.jsx"

const Repositories = () => {

    const [repos, setRepos] = useState([]);
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [error, setError] = useState(null);

    const frtchRepos = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await repositoryApi.getRepositories();
            setRepos(Array.isArray(data) ? data : data.Repositories || []);
        } catch (error) {
            setError(error.message || "Failed to load repositories.")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    const handleSync = async () => {
        try {
            setSyncing(true);
            setError(null);

            await repositoryApi.syncRepositories();
            await fetchRepos()
        } catch (error) {
            setError(err.message || "Failed to sync repositories with GitHub.");
        } finally {
            setSyncing(false);
        }
    }

    const handleToggleScan = async (id) => {
        try {
            setTogglingId(id);

            await repositoryApi.toggleRepoScanning(id);
            setRepos((prev) =>
                prev.map((repo) => (repo._id || repo.id) === id ? { ...repo, isScanningEnabled: !repo.isScanningEnabled } : repo)
            )
        } catch (error) {
            setError(err.message || "Failed to update repository scanning setting.");
        } finally {
            setTogglingId(null);
        }
    };

    const filteredRepos = filterRepositories(repos, search);



    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Repositories</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage synced GitHub repositories and toggle pull request security auditing.
                    </p>
                </div>
                <RepoSyncButton onSync={handleSync} isSyncing={syncing} />
            </div>

            <ErrorMessage message={error} onRetry={fetchRepos} />

           
            <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-500"
                />
            </div>

            
            <RepoList
                repos={filteredRepos}
                onToggleScan={handleToggleScan}
                togglingId={togglingId}
                isLoading={loading}
            />
        </div>
    );
}

export default Repositories
