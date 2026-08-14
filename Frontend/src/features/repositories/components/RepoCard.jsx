import React from 'react'
import { FolderGit2, Lock, Globe, ExternalLink } from "lucide-react"


export const RepoCard = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300">
                        <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                            {repo.name}
                            {repo.isPrivate ? (
                                <Lock className="w-3.5 h-3.5 text-amber-400" title="Private" />
                            ) : (
                                <Globe className="w-3.5 h-3.5 text-slate-500" title="Public" />
                            )}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{repo.fullName || repo.name}</p>
                    </div>
                </div>

                {repo.htmlUrl && (
                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-medium">Automatic Security Scan</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={Boolean(repo.isScanningEnabled)}
                        onChange={() => onToggleScan(repo._id || repo.id)}
                        disabled={isToggling}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
            </div>
        </div>
    );
}
