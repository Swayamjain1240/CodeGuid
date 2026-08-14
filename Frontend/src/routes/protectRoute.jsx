import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { Spinner } from "../components/common/Spinner.jsx"

export function ProtectRoute({ isAuthenticated, isLoading, children }) {

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Spinner size="lg" />
            </div>
        );
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
        
};