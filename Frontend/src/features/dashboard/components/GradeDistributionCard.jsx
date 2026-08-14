import React from 'react'
import { getGradePercentage } from "../DashboardUtils.jsx"


export const GradeDistributionCard = ({ grades = {} }) => {

    const gradeKeys = ["A", "B", "C", "D", "F"]

    const gradeColors = {
        A: "bg-emerald-500 text-emerald-400",
        B: "bg-cyan-500 text-cyan-400",
        C: "bg-amber-500 text-amber-400",
        D: "bg-orange-500 text-orange-400",
        F: "bg-rose-500 text-rose-400",
    }

    const total = Object.values(grades).reduce((acc, val) => acc + (val || 0), 0);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-100">Security Grade Breakdown</h3>

            <div className="space-y-3">
                {gradeKeys.map((grade) => {
                    const count = grades[grade] || 0;
                    const percentage = getGradePercentage(count, total);

                    return (
                        <div key={grade} className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-semibold text-slate-200">Grade {grade}</span>
                                <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${gradeColors[grade].split(" ")[0]}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
