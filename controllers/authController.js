import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

//generate jwt token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2m",
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
      role: role || "USER",
    });

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser),
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

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //compare now password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user),
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
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

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
