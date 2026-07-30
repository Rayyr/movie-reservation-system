import express from "express";
import { protect } from "../middlewares/authMiddleWare.js";
import { userOnly } from "../middlewares/roleMiddleWare.js";
import { editProfile } from "../controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();

router.patch(
  "/edit-profile",
  protect,
  userOnly,
  editProfile,
);

export default router;
