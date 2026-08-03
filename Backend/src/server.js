import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import cookieparser from "cookie-parser"
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import {app,server} from "./lib/Socket.js"


dotenv.config()

//for extra size
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieparser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

const PORT=process.env.PORT;

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes)

server.listen(PORT,(req,res)=>{
    console.log("Server is listening to Port :",PORT);
    connectDB()
})