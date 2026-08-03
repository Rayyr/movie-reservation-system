import express from 'express';
import {getSeatsForScreen} from '../controllers/seatController.js';

const router =express.Router();

router.get("/getSeatsForScreen/:screenID",getSeatsForScreen);

export default router;