import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const port= process.env.PORT;

app.listen(port,()=>{
    console.log("hi");
});