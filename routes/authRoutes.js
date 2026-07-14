import express from "express";
import { register, login } from "../controllers/authController.js";
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

router.post(
  "/register",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required!")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),

    body("email")
      .isEmail()
      .withMessage("Vali email is required")
      .notEmpty()
      .withMessage("Email is required!"),

    body("password")
      .isAlphanumeric()
      .withMessage("Password must have letters and numbers")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register,
);

export default router;
