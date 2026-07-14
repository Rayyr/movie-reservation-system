import User from "../models/User.js";

//role middlewares
//role-based access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") next();
  else return res.status(403).json({ message: "Admin only" });
};

export const userOnly = (req, res, next) => {
  if (req.user && req.user.role === "USER") next();
  else return res.status(403).json({ message: "User only" });
};
