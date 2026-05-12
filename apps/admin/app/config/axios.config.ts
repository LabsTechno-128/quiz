import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeToken,
} from "../utils/helpers";

let apiUrl;
if (process.env.NEXT_PUBLIC_API_URL) {
  apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`
} else {
  apiUrl = "https://api.thinkhive.net/api/v1";
}

/* Public request config */
const publicRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Private request config */
const privateRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Request Interceptor */
privateRequest.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

/* Response Interceptor for Refresh Token */
privateRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          removeToken();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(`${apiUrl}/auth/refresh-token`, {
          refreshToken,
        });

        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
          originalRequest.headers["Authorization"] =
            `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        removeToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

/* Upload Request config */
export const uploadRequest = axios.create({
  baseURL: apiUrl,
});

uploadRequest.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { publicRequest, privateRequest };
