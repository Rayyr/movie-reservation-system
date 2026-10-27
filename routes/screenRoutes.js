import {
    createScreen,
    getAllScreens,
    deleteScreenById,
    getScreenSeats
} from '../controllers/screenController.js';

import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';

import express from 'express';

const router=express.Router();

router.get("/",protect,adminOnly,getAllScreens);
router.post('/create',protect,adminOnly,createScreen);
router.delete('/:id',protect,adminOnly,deleteScreenById);

//get screen' seats  
router.get("/:id/seats/getSeats",protect,adminOnly,getScreenSeats);

export default router; 