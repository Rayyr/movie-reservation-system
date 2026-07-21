import { createShowTime,getShowTimesByMovieTilte,getAllShowTimes } from "../controllers/showTimeController";
import express from 'express';
import { adminOnly } from "../middlewares/roleMiddleWare";
import { protect } from "../middlewares/authMiddleWare";

const router=express.Router();


//by anyone
router.get("/getAll",getAllShowTimes);

//by anyone
router.get("/get/movie/:title",getShowTimesByMovieTilte);

//only by admin
router.post("/create",protect,adminOnly,createShowTime);
