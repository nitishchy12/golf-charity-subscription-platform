import express from "express";
import { createCharity, getCharities, updateCharity } from "../controllers/charityController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCharities);
router.post("/", protect, authorize("admin"), createCharity);
router.patch("/:id", protect, authorize("admin"), updateCharity);

export default router;
