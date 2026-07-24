import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

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
      role: toUpperCase(role)|| "USER",
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
      return res.status(400).json({ message: "Invalid credentials , there is no assiciated user with this email" });
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
      return res.status(400).json({ message: "Invalid credentials , wrong password" });
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
