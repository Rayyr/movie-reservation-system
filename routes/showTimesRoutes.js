import express from 'express';
import {getMovieShowTimes,createShowTime} from '../controllers/showTimesController.js';

const router=express.Router();


//just to add dummy data
router.get("/getMovieShowTimes/:movieID",getMovieShowTimes);
router.post("/create",createShowTime);


export default router;