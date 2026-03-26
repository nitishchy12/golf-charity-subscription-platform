import express from "express";
import {
  addScore,
  getProfile,
  getScores,
  updateCharitySelection,
  updateSubscription,
  uploadWinnerProof
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/me", getProfile);
router.patch("/subscription", updateSubscription);
router.get("/scores", getScores);
router.post("/scores", addScore);
router.patch("/charity", updateCharitySelection);
router.post("/winners/:winnerId/proof", upload.single("proof"), uploadWinnerProof);

export default router;
