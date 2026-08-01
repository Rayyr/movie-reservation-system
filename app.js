import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import { protect } from "./middlewares/authMiddleWare.js";
import { adminOnly, userOnly } from "./middlewares/roleMiddleWare.js";


const app=express();

//midlleware
app.use(express.json());
app.use(cors());


//use routes --auth routes http://localhost:5000/api/auth
app.use("/api/auth",authRoutes);

// admin routes
app.use("/api/admin",protect,adminOnly,adminRoutes);

//user routes
app.use("/api/user",userRoutes);

//movie routes
app.use("/api/movies",movieRoutes);//internally i specify the ACL and route protection

export default app;