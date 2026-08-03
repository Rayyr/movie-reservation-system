import express from 'express';
import {getMovieShowTimes} from '../controllers/showTimesController.js';

const router=express.Router();


//just to add dummy data
router.get("/getMovieShowTimes/:movieID",getMovieShowTimes);

export default router;