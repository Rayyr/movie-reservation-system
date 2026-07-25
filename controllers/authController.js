import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import SMTPConnection from "nodemailer/lib/smtp-connection/index.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import dotenv from 'dotenv';


dotenv.config();

//generate jwt token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

//register
export const register = async (req, res) => {
  try {
    //inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password, role } = req.body;

    //check if user exists
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exist!" });
    }

    //not exist
    //hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create user
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role.toUpperCase() || "USER",
    });

    // Set cookie on registration so they are automatically logged in safely
    res.cookie("authToken", generateToken(newUser), {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour matching JWT expiration
    });

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//login
export const login = async (req, res) => {
  try {
    //input validation
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    //find user based to email since it is unique
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message:
          "Invalid credentials , there is no assiciated user with this email",
      });
    }

    //compare now password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.cookie("authToken", generateToken(user), {
        httpOnly: true, // Prevents XSS attacks
        secure: false, // Ensures cookie is sent over HTTP
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 3600000, // Cookie expiration (e.g., 1 hours)
      });

      //success login
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
    //wrong password
    else {
      return res
        .status(400)
        .json({ message: "Invalid credentials , wrong password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.token = null;
    await user.save();

    // Clear the cookie directly on the browser
    res.clearCookie("authToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//generate reset link for forgot password + nodemail configs
export const forgotPassword = async (req, res) => {
  try {
    
    const { email } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Sorry,there isn't a user with this email" });
    }

    //token generation
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //token expiration period
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; //valid for 15-mins
    await user.save();

    
    //reset link sth like this : http:localhost:3000/reset-password/token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    
    //email sender configs
    const sender = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // The 16-character App Password
      },
    });

    await sender.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your Movie Reservation password",
      text: `Reset your password: ${resetUrl}`,
    });

    return res
      .status(200)
      .json({ message: "Reset link was successfully being sent" });
  } catch (error) {
     console.log(error);
    return res.status(500).json({ message: error });
  }
};

//resetPassword : check passwordToken expiration + password update if evrything is ok
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passswordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired.",
      });
    }

    //new updated password
    user.password = await bycrypt.hash(req.body.password, 10);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been updated successfully. Go and sign in" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
