import { Server } from "socket.io";
import Redis from "ioredis";
import http from "http";
import express from "express";
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

// app.use(cors()); // default allows all origins
app.use(cors({
    origin: 'http://localhost:4000', // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true
}));
app.use(express.json());

const wss = new Server(server, {
    cors: {
        // origin: ['*'],
        origin: [`http://localhost:4000`],
        methods: ['GET', 'POST'],
        // credentials: true
    }
})

wss.on('connection', (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("subscribe", (token, callback) => {
        if (!token) return;
        socket.join(token);
        console.log(`✅ ${socket.id} joined room: ${token}`);
        console.log("connection built between client and server");
        callback && callback({ joined: true });
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
    })
})

// reading all the redis messages from subscribed channel----------
redis.on("pmessage", async (pattern: string, channel: string, message: string) => {
    try {
        const [, token] = channel.split(':');
        console.log("channel----", channel);
        console.log("token in backend----", token);
        const payload = JSON.parse(message);
        console.log("payload---", payload);

        wss.to(token).emit("submission-update", payload);
    } catch (err) {
        console.error("Malformed pubsub message", err);
    }
})

redis.psubscribe("submission:*", (err) => {
    if (err) console.error("Error while listening the redis server")
    else console.log("Subscribe to all the channels");
})


export { app, server } 