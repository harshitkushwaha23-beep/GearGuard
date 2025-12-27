import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` || "http://localhost:5000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosInstance;
