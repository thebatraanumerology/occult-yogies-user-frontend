import axios from "axios";
import Cookies from "js-cookie";
import { BaseURL } from "../constants/BaseURL";

const axiosInstance = axios.create({ 
  baseURL: BaseURL,
  headers: {
    'Accept': 'application/json', // 👈 Prevents Laravel from redirecting to login
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("oy_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Optional: Add a response interceptor to handle 401s globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      Cookies.remove("oy_token");
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;