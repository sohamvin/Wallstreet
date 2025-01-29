import axios from "axios";

const API_URL = "http://localhost:3000";

const axiosNoAuthInstance = axios.create({
    baseURL: API_URL,
});

// const axiosAuthInstance = axios.create({
//     baseURL: API_URL,
// });

// axiosAuthInstance.interceptors.request.use(
//     (config) => {
//         if(localStorage.getItem("user")){
//             config.headers.Authorization = `Token ${localStorage.getItem("user")}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// )

export {axiosNoAuthInstance};
