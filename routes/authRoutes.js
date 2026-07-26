import express from "express";
import {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { body } from "express-validator";

const router = express.Router();

//auth routes
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
      .isAlphanumeric()
      .withMessage("Password must have letters and numbers")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  login,
);

router.post("/signup", register);

router.post("/logout", protect, logout);

router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  resetPassword,
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  forgotPassword,
);

export default router;
