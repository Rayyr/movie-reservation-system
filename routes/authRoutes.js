import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { adminOnly,protect,userOnly } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/user",protect,userOnly,(req,res)=>{
    res.json({message:"hello"});
})
 
export default router;
