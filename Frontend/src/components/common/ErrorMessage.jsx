import React from 'react'
import { AlertTriangle } from "lucide-react"

export const ErrorMessage = ({message, onRetry}) => {

    if(!message) return null ;

  return (
    <div className='flex items-center justify-between p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 my-2 '>
        <div className='flex items-center gap-3'>
            <AlertTriangle className='w-5 h-5 shrink-0' />
            <p className='text-sm'> {message} </p>
        </div>
      {onRetry && (
        <button onClick={onRetry} className='text-xs font-semibold underline hover:text-rose-300 transition-colors'
        >
            Try Again
        </button>

      )}
    </div>
  );
};
