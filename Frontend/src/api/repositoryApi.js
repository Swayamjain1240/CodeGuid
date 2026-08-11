import axiosClient from "./axiosClient.js";

export const repositoryApi = {
    getRepositories: (params) => axiosClient.get("/repositories", {params}),

    getRepositoryById: (id)=> axiosClient.get(`/repositories/${id}`),

    syncRepositories: () => axiosClient.post("/repositories/sync"),

    toggleRepoScanning: (id) => axiosClient.patch(`/repositories/${id}/toggle`),
}