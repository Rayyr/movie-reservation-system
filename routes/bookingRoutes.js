 import {getAvailableSeats,createBooking} from "../controllers/bookingController.js"
 import express from 'express';
import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';
import { userOnly } from "../middlewares/roleMiddleWare.js";
const router=express.Router();


//by only admin
router.post("/",protect,userOnly,createBooking);

 router.get("/getAvailableSeats/:showTimeId/seats",getAvailableSeats);
 
export default router;