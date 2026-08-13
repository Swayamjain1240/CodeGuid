import React from 'react'
import { Button } from "../../../components/common/Button.jsx"
import { RefreshCw } from 'lucide-react'


export const RepoSyncButton = ({ onSync, isSyncing }) => {
    return (
        <button onClick={onSync} isLoading={isSyncing} variant="secondary" className='gap-2 shrink-0 cursor-pointer'>
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync Repositories</span>
        </button>
    )
}
