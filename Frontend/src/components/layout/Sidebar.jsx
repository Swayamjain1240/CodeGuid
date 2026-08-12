import React from 'react'
import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderGit2, GitPullRequest } from "lucide-react"

const Sidebar = () => {

    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Repositories", path: "/repositories", icon: FolderGit2 },
        { label: "Pull Requests", path: "/pull-requests", icon: GitPullRequest },
    ];

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-1.5 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                }`
                            }
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
