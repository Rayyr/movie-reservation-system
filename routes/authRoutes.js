import express from "express";
import {
  register,
  login,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { body } from "express-validator";

const router = express.Router();

//auth routes -anyone
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

//-anyone
router.post("/signup", register);

//since logout at backend actually dont do anything just it returns a msg so its useless so it will be handled from frontend side
/* router.post("/logout", protect, logout);
 */

//-anyone
router.post(
  "/reset-password/:token",

  resetPassword,
);

//-anyone
router.post("/forgot-password", forgotPassword);

export default router;
