import axios from "axios"

export const axiosInstance=axios.create({
    baseURL:"http://localhost:8080/api",
    withCredentials:true,  //sending cookies to the backend server with api request
})