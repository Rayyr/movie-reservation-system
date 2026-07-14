import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { adminOnly, userOnly } from "./middlewares/roleMiddleWare.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { protect } from "./middlewares/authMiddleWare.js";

const app=express();

//midlleware
app.use(express.json());
app.use(cors());


//use routes --auth routes
app.use("/auth",authRoutes);

// admin routes
app.use("/admin",protect,adminOnly,adminRoutes);

//user routes
app.use("/user",protect,userOnly,userRoutes);

export default app;