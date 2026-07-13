import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const port= 5000;

app.listen(port,()=>{
    console.log("hi");
});