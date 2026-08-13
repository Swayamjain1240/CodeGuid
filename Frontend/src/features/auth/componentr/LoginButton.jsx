import React from 'react'
import { Github } from "lucide-react"
import {redirectToGitHub} from "../AuthUtils.js"

const LoginButton = () => {
  return (
    <button onClick={redirectToGitHub} className='w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-semibold text-sm transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer'>
        <Github className="w-5 h-5 shrink-0 text-slate-950" />
        <span>Continue with GitHub</span>
    </button>
  )
}

export default LoginButton