import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import cookieparser from "cookie-parser"
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import {app,server} from "./lib/Socket.js"
import path from "path"

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

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../../Frontend/dist");
    app.use(express.static(distPath));

    app.get("*splat", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

server.listen(PORT,(req,res)=>{
    console.log("Server is listening to Port :",PORT);
    connectDB()
})