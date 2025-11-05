import express from "express";
import cors from 'cors';
import submitRoute from "./routes/submitroute"

const app = express();
app.use(cors()); // default allows all origins
// app.use(cors({
//     origin: 'http://localhost:4000', // frontend origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
app.use(express.json());

app.use("/submit", submitRoute);

// app.get("/", async (req, res) => {
//     console.log("Server working");

// })

app.listen(3000, () => {
    console.log("server running on port 3000");
})