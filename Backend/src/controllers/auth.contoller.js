import bcryptjs from "bcryptjs"
import User from "../models/User.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"


export const signupController = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json("All credentials are required !!")
        }
        if (password.length < 6) {
            return res.status(400).json("Password must be atleast of 6 characters !!")
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json("User with this email aready exist !!")
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        } else {
            res.status(400).json("Invalid User Data")
        }

    } catch (error) {
        console.log(`Singup Controller Error ${error.message}`)
        res.status(500).json(`Internal Server Error : ${error.message}`)
    }
}

export const loginController = async(req, res) => {
    const {email,password} =req.body;
    try{
        if(!email || !password){
            return res.status(400).json("All credentials are required !!")
        }
        if (password.length < 6) {
            return res.status(400).json("Password must be atleast of 6 characters !!")
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json("Invalid Email or Password")
        } 

        const isPasswordCorrect=await bcryptjs.compare(password,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json("Invalid Credentials")
        }

        generateToken(user._id,res);
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePic:user.profilePic
        })

    }catch(error){
        console.log("login Controller Error",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const logoutController = async(req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("Logout Controller Error :",error.message)
        res.status(500).json({message:"Internal Server Error"})

    }
}

export const updateController=async (req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }

        const updateUser=await User.findByIdAndUpdate(
            userId,
            { profilePic },
            { new: true }
        );

        if(!updateUser){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json(updateUser)

    }catch(error){
        console.log(`Error in Update Controller : ${error.message}`)
        res.status(500).json({message:"Internal Server error"})
    }
}

export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Check Auth Server Error :",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}