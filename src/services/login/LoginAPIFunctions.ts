import axios from "axios";
import { BaseURL } from "../../constants/BaseURL";
import Cookies from "js-cookie";
import { ResetPasswordDTO } from "@/src/types/loginAPITypes";

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

export const doForgotPassword = async (data: any) => {
  try {
    const response = await axios.post(`${BaseURL}/public/user/forgot-password`, data);
    return response.data;
  } catch (error) {
    console.error("Forgot password failed:", error);
    throw error;
  }
};

export const doResetPassword = async (data: ResetPasswordDTO) => {
  try {
    const body = {
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      token: data.token,
    }
    const response = await axios.post(`${BaseURL}/public/user/reset-password`, body);
    return response.data;
  } catch (error) {
    console.error("Reset password failed:", error);
    throw error;
  }
};