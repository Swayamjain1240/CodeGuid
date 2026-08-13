import React from 'react'
import {Route, Routes, Navigate } from "react-router-dom"
import {ProtectRoute} from "./ProtectRoute.jsx"
import {AppLayout} from "../components/layout/AppLayout.jsx"
import {NotFound} from "../pages/NotFound.jsx"
import { useAuth } from "../hooks/useAuth.js"
import { Login } from "../pages/Login.jsx"
import { Dashboard } from '../pages/Dashboard.jsx'
import { Repositories } from "../pages/Repositories.jsx"
import { PullRequestsDetail } from "../pages/PullRequestsDetail.jsx"


const AppRoutes = ({user, isLoading, onLogout}) => {

    const isAuthenticated = Boolean(user);

  return (
    <Routes>
        <Route path='/login' element={ <LoginPlaceholder />} />
    </Routes>
  )
}

export default AppRoutes
