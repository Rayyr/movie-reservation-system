 import {getSeatsStatus,createBooking} from "../controllers/bookingController.js"
 import express from 'express';
import { protect } from '../middlewares/authMiddleWare.js';
import { adminOnly } from '../middlewares/roleMiddleWare.js';
import { userOnly } from "../middlewares/roleMiddleWare.js";
const router=express.Router();


 
router.post("/create",createBooking);

 router.get("/getSeatsStatus/:showTimeId/seats",getSeatsStatus);
 
export default router;