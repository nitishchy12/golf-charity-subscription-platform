import express from "express";
import { login, seedAdmin, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/seed-admin", seedAdmin);

export default router;
