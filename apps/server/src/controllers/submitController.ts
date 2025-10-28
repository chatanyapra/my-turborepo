import { Request, Response } from "express";
import { RequestWithBody } from "../types/controllertype";
import { v4 as uuid } from "uuid";
import { codeQueue } from "../config/bullMQ";

export const submitController = async (req: Request<{}, {}, RequestWithBody>, res: Response): Promise<void> => {
    const { userid, code, language_id, stdin } = req.body;
    const token = uuid();
    console.log(userid, code, language_id, stdin);

    // adding to queue-----------
    const jobresult = await codeQueue.add("run-code", { token: token, userid: userid, language_id: language_id, code: code, stdin });
    if (res) {
        res.json({ token, job_id: jobresult.id });
    }
};