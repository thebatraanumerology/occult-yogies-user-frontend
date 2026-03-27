import axios from "axios";
import { BaseURL } from "../../constants/BaseURL";
import Cookies from "js-cookie";

const token = Cookies.get("oy_token");

export const doLogin = async (data: any) => {
  try {
    const response = await axios.post(`${BaseURL}/public/user/logins`, data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const doLogout = async () => {
  try {
    
    const response = await axios.post(
      `${BaseURL}/user/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};