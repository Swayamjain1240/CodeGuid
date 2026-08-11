import axiosClient from "./axiosClient.js";

export const authApi = {
    getCurrentUser: () => axiosClient.get("/auth/me"),

    loginWithGitHub: () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}/auth/github`;
    },

    refreshToken: () => axiosClient.post("/auth/refresh"),

    logout: ()=> axiosClient.post("/auth/logout"),
};