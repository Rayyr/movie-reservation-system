import { createTheater } from "../controllers/theaterController.js";

import express from 'express';

const router=express.Router();


//just to add dummy data
router.post("/create",createTheater);

export default router;