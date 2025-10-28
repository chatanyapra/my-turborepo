import express from "express";
const app = express();
import submitRoute from "./routes/submitroute"

app.use(express.json());

app.use("/submit", submitRoute);

// app.get("/", async (req, res) => {
//     console.log("Server working");

// })

app.listen(3000, () => {
    console.log("server running on port 3000");
})