import { Server } from "socket.io";
import http from "http";
import express from "express"
import cors from"cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

const userSocketMap={} //mapping the userId  and socketid  


io.on("connection", (socket) => {
    console.log("A User Connected ", socket.id);

    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A User disconneted", socket.id)    
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export { io, app, server };