import React from 'react'
import { User, LogOut } from "lucide-react"


export const UserProfile = ({ user, onLogout }) => {

    if (!user) return null;

    return (
        <div className='flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl'>
            {user.avatarUrl ? (
                <img
                    src={user.avatarUrl}
                    alt={user.username || "User"}
                    className="w-8 h-8 rounded-full border border-slate-700"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-4 h-4" />
                </div>
            )};

            <div className="flex flex-col text-xs">
                <span className="font-semibold text-slate-200">{user.username || "Developer"}</span>
                <span className="text-slate-500">{user.email || "GitHub Authenticated"}</span>
            </div>
            <button
                onClick={onLogout}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </button>

        </div>
    )
}

