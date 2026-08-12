import React from 'react'

const Badge = ({ children, variant = "default", className = "" }) => {

  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    critical: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge