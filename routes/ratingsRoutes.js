import express from 'express';
import {getIfUserRate} from '../controllers/ratingsController.js';
import { protect } from '../middlewares/authMiddleWare.js';

const router=express.Router();


router.get("/IfUserRate/:movieID",protect,getIfUserRate);

export default router;