import axiosClient from "./axiosClient";

export const pullRequestApi = {
  
  getPullRequests: (params) => axiosClient.get("/pull-requests", { params }),
  
  
  getPullRequestById: (id) => axiosClient.get(`/pull-requests/${id}`),
  
  
  rescanPullRequest: (id) => axiosClient.post(`/pull-requests/${id}/rescan`),
};