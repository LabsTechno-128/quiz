// import { getToken } from "@/utils/helpers";
import axios from "axios";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
// const apiUrl = `http://localhost:8000/api/v1`
// const apiUrl = "https://api.thinkhive.net/api/v1"
/* Publica/Common request config */
axios.defaults.headers.post["Content-Type"] = "application/json";

const publicRequest = axios.create({
  baseURL: apiUrl,
});

const privateRequest = axios.create({
  baseURL: apiUrl,
});

/* Public request config */
publicRequest.interceptors.request.use(
  async (config) => {
    if (config.headers === undefined) {
      // config.headers = {};
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);

/* Private request config */
privateRequest.interceptors.request.use(
  async (config) => {
    // const token = getToken();
    if (config.headers === undefined) {
      // config.headers = {};
    }
    // if (token) {
    //     config.headers["content-type"] = 'multipart/form-data';
    //     config.headers["Authorization"] = "Bearer " + token || "";
    // }
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);

export { publicRequest, privateRequest };
