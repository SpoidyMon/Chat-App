import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { toast } from "react-hot-toast"



export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogginIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,  // intialy on loading

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

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
            toast.success("Logout Successfully")
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
            toast.success("LogedIn Successfully")
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
}))