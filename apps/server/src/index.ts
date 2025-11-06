import submitRoute from "./routes/submitroute"
import { app, server } from "./config/websocket";

app.use("/api", submitRoute);

app.get("/", async (req, res) => {
    console.log("Server working");

})

server.listen(3000, () => {
    console.log("server running on port 3000");
})