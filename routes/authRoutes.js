import express from "express";
import { register, login, logout } from "../controllers/authController.js";
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

router.post("/register", register);

router.post("/logout", protect, logout);
export default router;
