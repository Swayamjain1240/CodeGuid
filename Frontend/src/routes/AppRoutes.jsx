import React from 'react'
import {Route, Routes, Navigate } from "react-router-dom"
import {ProtectRoute} from "./ProtectRoute.jsx"
import {AppLayout} from "../components/layout/AppLayout.jsx"
import {NotFound} from "../pages/NotFound.jsx"
import { useAuth } from "../hooks/useAuth.js"
import { Login } from "../pages/Login.jsx"
import { Dashboard } from '../pages/Dashboard.jsx'
import { Repositories } from "../pages/Repositories.jsx"
import { PullRequests } from "../pages/PullRequests.jsx"
import { PullRequestsDetail } from "../pages/PullRequestsDetail.jsx"


const AppRoutes = () => {

  const { user, loding, logout, isAuthenticated } = useAuth();

  return (
    <Routes>
        <Route path='/login' element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route element={<ProtectRoute isAuthenticated={isAuthenticated} isLoading={loding}> 
              <AppLayout user={user} onLogout={logout} />
            </ProtectRoute>}
        />

        <Route path='/' element={<Navigate to="/dashboard" replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/repositories' element={<Repositories />} />
        <Route path='/pull-requests' element={<PullRequests />} />
        <Route path='/pull-requests/:id' element={<PullRequestsDetail />} />
        
        <Route path='*' element={<NotFound />} />
    </Routes>

  );
};

export default AppRoutes
