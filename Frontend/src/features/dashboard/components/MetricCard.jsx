import React from 'react'

export const MetricCard = () => {

    const color = {
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between">
            <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-100">{value ?? 0}</p>
                {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
            </div>

            {Icon && (
                <div className={`p-3 rounded-xl border ${colors[color] || colors.cyan}`}>
                    <Icon className="w-5 h-5" />
                </div>
            )}
        </div>
    );
}
