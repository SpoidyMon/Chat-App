import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8080" : "";

export const axiosInstance=axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials:true,  //sending cookies to the backend server with api request
})