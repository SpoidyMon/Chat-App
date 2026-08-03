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

io.on("connection", (socket) => {
    console.log("A User Connected ", socket.id);

    socket.on("disconnect", () => {
        console.log("A User disconneted", socket.id)
    })
})

export { io, app, server };