import React from 'react'
import {Route, Routes, Navigate } from "react-router-dom"
import {ProtectRoute} from "./ProtectRoute.jsx"
import {AppLayout} from "../components/layout/AppLayout.jsx"
import {NotFound} from "../pages/NotFound.jsx"

const LoginPlaceholder = () => <div className="p-8 text-slate-300">Login Page</div>;
const DashboardPlaceholder = () => <div className="p-8 text-slate-300">Dashboard Page</div>;
const RepositoriesPlaceholder = () => <div className="p-8 text-slate-300">Repositories Page</div>;
const PullRequestsPlaceholder = () => <div className="p-8 text-slate-300">Pull Requests Page</div>;
const PRDetailsPlaceholder = () => <div className="p-8 text-slate-300">PR Details Page</div>;

const AppRoutes = ({user, isLoading, onLogout}) => {

    const isAuthenticated = Boolean(user);

  return (
    <Routes>
        <Route path='/login' element={ <LoginPlaceholder />} />
    </Routes>
  )
}

export default AppRoutes
