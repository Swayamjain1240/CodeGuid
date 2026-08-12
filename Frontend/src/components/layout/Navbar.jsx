import React from 'react'
import { Shield, LogOut, User } from "lucide-react"

const Navbar = ({ user, onLogout }) => {
    return (
        <header className='h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40'>
            <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'>
                    <Shield className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-slate-100 tracking-wide">
                    Git<span className="text-cyan-400">Guard</span>
                </span>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
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
                            )}
                            <span className="font-medium hidden sm:inline">{user.username || "User"}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : null}
            </div>
        </header>
    );
};

export default Navbar