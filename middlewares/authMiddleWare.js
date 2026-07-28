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

    // 3. Verify token : check for expiry time:if expired 401 error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5. Attach user to request obj
    req.user = user;

    // 6. Continue
    next();

  } catch (error) {
    //the token expiry error will be noticable in case the token is expired while an api action in processs and the api action is protected or even the timer may overwrite it
        if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message:error.message});
  }
};

