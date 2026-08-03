import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast"
import io from "socket.io-client";

const BASE_URL=import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket:null,
    isCheckingAuth: true,  // intialy on loading
    onlineUsers:[],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth : ", error);
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data || "Signup failed";
            toast.error(msg);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logout Successfully");
            get().disconnectSocket();
        } catch (error) {
            const msg = error?.response?.data?.message || "Logout failed";
            toast.error(msg)
        }
    },

    login: async (data) => {
        set({ isLogginIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data })
            toast.success("LogedIn Successfully");
            get.connectSocket();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data || "Login failed";
            toast.error(msg)
        } finally {
            set({ isLogginIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateprofile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            const msg = error?.response?.data?.message || "Profile update failed";
            toast.error(msg);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;

        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnectSocket();
    }
}))