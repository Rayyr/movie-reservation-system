import express from 'express';
import {
  getMovieShowTimes,
  createShowTime,
  deleteShowTimeById,
} from '../controllers/showTimesController.js';
import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';

const router=express.Router();


//just to add dummy data
router.get("/getMovieShowTimes/:movieID",getMovieShowTimes);
router.post("/create",protect,adminOnly,createShowTime);
router.delete("/:id",protect,adminOnly,deleteShowTimeById);


export default router;