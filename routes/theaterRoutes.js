import { createTheater } from "../controllers/theaterController.js";

import express from 'express';

const router=express.Router();


router.post("/create",createTheater);

export default router;