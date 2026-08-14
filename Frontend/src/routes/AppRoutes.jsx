import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { ProtectRoute } from "./ProtectRoute.jsx";
import { AppLayout } from "../components/layout/AppLayout.jsx";

import { NotFound } from "../pages/NotFound.jsx";
import { Login } from "../pages/Login.jsx";
import { Dashboard } from "../pages/Dashboard.jsx";
import { Repositories } from "../pages/Repositories.jsx";
import { PullRequests } from "../pages/PullRequests.jsx";
import { PullRequestsDetail } from "../pages/PullRequestsDetail.jsx";
import { AuthSuccess } from "../pages/Authsuccess.jsx";

import { useAuth } from "../hooks/useAuth.js";

export const AppRoutes = () => {

    const {
        user,
        loading,
        logout,
        isAuthenticated
    } = useAuth();

    return (
        <Routes>

            {/* Public login */}
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Login />
                }
            />

            {/* GitHub OAuth callback */}
            <Route
                path="/auth-success"
                element={<AuthSuccess />}
            />

            {/* Protected application */}
            <Route
                element={
                    <ProtectRoute
                        isAuthenticated={isAuthenticated}
                        isLoading={loading}
                    />
                }
            >

                {/* Application Layout */}
                <Route
                    element={
                        <AppLayout
                            user={user}
                            onLogout={logout}
                        />
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/repositories"
                        element={<Repositories />}
                    />

                    <Route
                        path="/pull-requests"
                        element={<PullRequests />}
                    />

                    <Route
                        path="/pull-requests/:id"
                        element={<PullRequestsDetail />}
                    />

                </Route>

            </Route>

            {/* Default */}
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* 404 */}
            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
};