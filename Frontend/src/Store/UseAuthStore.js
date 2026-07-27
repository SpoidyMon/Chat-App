import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { checkAuth } from "../../../Backend/src/controllers/auth.contoller"
import axios from "axios"

export const useAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLogginfUp:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,  // intialy on loading

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/api/check");
            set({authUser:res.data});

        } catch (error) {
            console.log("Error in checkAuth : ",error);
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    }
}))