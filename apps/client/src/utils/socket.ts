import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: true,
    // withCredentials: true,
});
socket.on("connect", () => {
    console.log("🟢 Connected to server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("🔴 Disconnected from server");
});

export default socket;
