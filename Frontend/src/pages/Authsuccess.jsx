import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Spinner } from "../components/common/Spinner.jsx";

export const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");

      if (token) {
        // Save the JWT token received from backend OAuth redirect
        localStorage.setItem("token", token);
      }

      // Re-fetch current user session
      if (refreshUser) {
        await refreshUser();
      }

      // Redirect to main dashboard
      navigate("/dashboard", { replace: true });
    };

    handleAuth();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-400">Authenticating session, please wait...</p>
    </div>
  );
};