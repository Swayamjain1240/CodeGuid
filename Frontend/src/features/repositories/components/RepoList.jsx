import React from 'react'
import { RepoCard } from "./RepoCard.jsx"
import { Spinner } from "../../../components/common/Spinner.jsx"

export const RepoList = ({ repos, onToggleScan, togglingId, isLoading }) => {

    if (isLoading) {
        return (
            <div className='py-12 flex justify-center'>
                <Spinner size="lg" />
            </div>
        );
    }

    if (repos.length === 0) {
        return (
            <div className='p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-sm'>
                No repositories found matching your search.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
                <RepoCard
                    key={repo._id || repo.id}
                    repo={repo}
                    onToggleScan={onToggleScan}
                    isToggling={togglingId === (repo._id || repo.id)}
                />
            ))}
        </div>
    )
};