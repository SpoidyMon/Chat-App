import jwt from "jsonwebtoken"
import User from "../models/User"

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookie.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorised-No token provided"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorised-Invalid token"})
        }
        const user=await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.user=user;
        next()

    }catch(error){
        console.log("Error in Protection Middleware : ",error.message);
        res.status(500).json({message:'Internal Server Error'})
    }
}