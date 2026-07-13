import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app=express();

//midlleware
app.use(express.json());
app.use(cors());


//use routes 
app.use("/auth",authRoutes);

export default app;