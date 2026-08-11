import axios from "axios"

const axiosClient = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers:{
        "Content-Type":"application/json",
    },
})

axiosClient.interceptors.response.use(

    (response)=> response.data,
    (error)=> {
        const customError = {
            message: error.response?.data?.error || error.response?.data?.message||"A network/server error occurred.", 
            status: error.response?.status,
        };

        if(error.response?.status === 401){
            if(window.location.pathname !== "/login"){
                window.location.href = "/login";
            }
        }

        return Promise.reject(customError);
    }
);

export default axiosClient;