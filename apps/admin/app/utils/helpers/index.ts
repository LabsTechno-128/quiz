import { Toastify } from "@/app/components/ui/toastify";
import Cookies from "js-cookie";

/* Access Token */
export const setAccessToken = (token: string) => {
  Cookies.set("accessToken", token, { expires: 1 / 24, path: "/" }); // 1 hour
  return true;
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("accessToken");
  }
};

/* Refresh Token */
export const setRefreshToken = (token: string) => {
  Cookies.set("refreshToken", token, { expires: 7, path: "/" }); // 7 days
  return true;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("refreshToken");
  }
};

/* User Data */
export const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
  return true;
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};

/* Compatibility with old code */
export const getToken = () => getAccessToken();
export const setToken = (token: string) => setAccessToken(token);

/* Clear Auth */
export const removeToken = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("user");
  return true;
};

/* Phone number valid check */
export const isValidPhone = () => {
  const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/i;
  return regex;
};

/* E-mail valid check */
export const isValidEmail = () => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex;
};

/* Global network error handeller */
export const networkErrorHandeller = (error: any) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.errors
  ) {
    error.response.data.errors.map((item: any, index: number) => {
      return Toastify.Error(error?.response?.data?.errors[0]);
    });
  } else {
    return Toastify.Error("Something going wrong, Try again.");
  }
};
