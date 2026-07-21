import {getAvailableSeats,createBooking} from '../controllers/bookingController.js';
import express from 'express';
import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';

const router=express.Router();


//by only admin
router.post("/create/:userId",protect,adminOnly,createBooking);

router.getAvailableSeats("/get/:showTimeId/seats",getAvailableSeats);