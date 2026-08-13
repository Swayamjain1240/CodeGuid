import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

const NotFound = () => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-950 p-4'>
            <div className="text-center max-w-md">
                <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
                    <ShieldAlert className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">404 - Page Not Found</h1>
                <p className="text-slate-400 text-sm mb-6">
                    The security route or resource you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/dashboard font-medium"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors text-sm font-semibold"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default NotFound