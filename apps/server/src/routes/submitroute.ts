import express from "express";
import { submitController } from "../controllers/submitController";

const router = express.Router();
router.post("/", submitController)

export default router;