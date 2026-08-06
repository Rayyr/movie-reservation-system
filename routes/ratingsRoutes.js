import express from 'express';
import {getIfUserRate,submitRating} from '../controllers/ratingsController.js';
import { protect } from '../middlewares/authMiddleWare.js';

const router=express.Router();


router.get("/IfUserRate/:movieID",protect,getIfUserRate);
router.post("/submitRating/:movieID",protect,submitRating);

export default router;