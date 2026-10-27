import {
  createTheater,
  deleteTheaterById,
  getAllTheaters,
} from "../controllers/theaterController.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { adminOnly } from "../middlewares/roleMiddleWare.js";

import express from 'express';

const router=express.Router();

router.get("/",protect,adminOnly,getAllTheaters);

//just to add dummy data
router.post("/create",protect,adminOnly,createTheater);
router.delete("/:id",protect,adminOnly,deleteTheaterById);

export default router;