import express from "express";
import { submitController } from "../controllers/submitController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();
router.post("/", authenticate, submitController)

export default router;