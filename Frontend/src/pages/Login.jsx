import React from 'react'
import { Shield, Lock } from "lucide-react"
import { LoginButton } from "../features/auth/componentr/LoginButton.jsx"


function Login() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-10 -left-10 pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur relative z-10 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
                    <Shield className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-slate-100 mb-2">
                    Git<span className="text-cyan-400">Guard</span>
                </h1>
                <p className="text-slate-400 text-sm mb-8">
                    Automated Pull Request Security Audit & Vulnerability Scanner
                </p>

                <LoginButton />

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Secure OAuth 2.0 GitHub Authentication</span>
                </div>
            </div>
        </div>
    );
}

export default Login