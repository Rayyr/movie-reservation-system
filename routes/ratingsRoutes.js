import express from 'express';
import {getIfUserRate} from '../controllers/ratingsController.js';
const router=express.Router();


router.get("/IfUserRate/:movieID",getIfUserRate);

export default router;