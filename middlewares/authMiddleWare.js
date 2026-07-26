import jwt from "jsonwebtoken";
import User from "../models/User.js";
 

//check if authenticated+token validation
export const protect = async (req, res, next) => {
  
    try {
    let token;

    // 1. Check header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; 
    }

    // 2. If no token
    if (!token) {
      return res.status(401).json({ message: "No token, not authorized" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5. Attach user to request body
    req.user = user;

    // 6. Continue
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token"});
  }
};

