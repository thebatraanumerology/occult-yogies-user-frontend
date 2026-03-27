import axios from "axios";
import Cookies from "js-cookie";
import { BaseURL } from "../constants/BaseURL";

const axiosInstance = axios.create({ baseURL: BaseURL });

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("oy_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;