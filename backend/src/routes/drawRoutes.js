import express from "express";
import { createDraw, getDraws, getWinners } from "../controllers/drawController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDraws);
router.get("/winners", protect, getWinners);
router.post("/", protect, authorize("admin"), createDraw);

export default router;
