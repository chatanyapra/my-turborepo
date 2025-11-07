import dotenv from 'dotenv';
import submitRoute from "./routes/submitroute";
import { app, server } from "./config/websocket";
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/user.routes';
import problemRoutes from './routes/problem.routes';
import submissionRoutes from './routes/submission.routes';
import prisma from './lib/prisma';

// Load environment variables
dotenv.config();

// API Routes
app.use("/api/submit", submitRoute);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

// Health check
app.get("/", async (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: "Server is healthy",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            database: "disconnected"
        });
    }
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});