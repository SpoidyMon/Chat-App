import mongoose, { mongo } from "mongoose";

export const connectDB=async ( )=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connection Successfull")

    }catch(error){
        console.log("Database Connection failed :",error)
    }
}