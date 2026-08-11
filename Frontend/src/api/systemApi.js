import axiosClient from "./axiosClient";

export const systemApi = {
  
  getHealthStatus: () => axiosClient.get("/health"),
  
};