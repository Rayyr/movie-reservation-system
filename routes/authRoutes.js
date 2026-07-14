import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleWare.js";

import { adminOnly, userOnly } from "../middlewares/roleMiddleWare.js";
const router = express.Router();

//auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
