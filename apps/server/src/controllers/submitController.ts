import { Request, Response } from "express";
import { RequestWithBody } from "../types/controllertype";
import { v4 as uuid } from "uuid";
import { codeQueue } from "../config/bullMQ";

export const submitController = async (req: Request<{}, {}, RequestWithBody>, res: Response): Promise<void> => {
    try {
        const { source_code, language_id, stdin } = req.body;
        const user_id = req.params;
        const token = uuid();
        console.log(" Submitting code=========:", source_code);

        // adding to queue-----------
        const jobresult = await codeQueue.add("codeQueue", {
            token: token,
            language_id: language_id,
            source_code: source_code,
            stdin
        });
        console.log(" Job added to queue:", jobresult.id, "with token:", token);

        res.json({ token, job_id: jobresult.id });
    } catch (error) {
        console.error(" Error in submitController:", error);
        res.status(500).json({
            error: "Failed to submit code to queue",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
};