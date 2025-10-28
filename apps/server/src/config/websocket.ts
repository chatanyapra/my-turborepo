import { Server } from "socket.io";
import Redis from "ioredis";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

const wss = new Server(server, {
    cors: {
        origin: ['*'],
        // origin: [`http://localhost:4000`],
        // methods: ['GET', 'POST'],
        // credentials: true
    }
})

wss.on('connection', (socket) => {
    console.log("socket id", socket.id);

    socket.on("subscribe", (token) => {
        if (!token) return;
        socket.join(token);
        console.log("connection built between client and server");
    })
    socket.on("disconnect", () => {
        console.log("socket disconnected", socket.id);
    })
})

// reading all the redis messages from subscribed channel----------
// redis.on("message", (cha))


export { app, server } 