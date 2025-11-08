import { Request, Response } from "express";
import { RequestWithBody } from "../types/controllertype";
import { v4 as uuid } from "uuid";
import { codeQueue } from "../config/bullMQ";

export const submitController = async (req: Request<{}, {}, RequestWithBody>, res: Response): Promise<void> => {
    const { source_code: code, language_id, stdin } = req.body;
    const user_id = req.params;
    const token = uuid();
    console.log("code, language_id, stdin==========user_id-----", code, language_id, stdin, user_id);
    // adding to queue-----------
    const jobresult = await codeQueue.add("codeQueue", { token: token, language_id: language_id, code: code, stdin });
    console.log("jobresult============", jobresult);

    if (res) {
        res.json({ token, job_id: jobresult.id });
    }
};