// import { getToken } from "@/utils/helpers";
import axios from "axios";



// const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`
const apiUrl = "http://127.0.0.1:8000/api"
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
    }
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
    }
);

export { publicRequest, privateRequest };