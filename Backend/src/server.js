import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieparser from "cookie-parser"
import authRoutes from './routes/auth.routes.js'

const app=express()
dotenv.config()
app.use(express.json())
app.use(cookieparser());

const PORT=process.env.PORT;

app.use("/api/auth",authRoutes)

app.listen(PORT,(req,res)=>{
    console.log("Server is listening to Port :",PORT);
    connectDB()
})