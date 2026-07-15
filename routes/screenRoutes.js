import {
    createScreen,
    getScreenSeats
} from '../controllers/screenController.js';

import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';

import express from 'express';

const router=ExpressValidator.Router();

//create screen by admin only
router.post('/create',protect,adminOnly,createScreen);

//get screen' seats  
router.get("/:screenId/seats/getSeats",protect,getScreenSeats);

export default router;