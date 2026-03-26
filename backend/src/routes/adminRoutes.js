import express from "express";
import { getUsers, updateUserSubscription, updateWinnerStatus } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/subscription", updateUserSubscription);
router.patch("/winners/:id/status", updateWinnerStatus);

export default router;
