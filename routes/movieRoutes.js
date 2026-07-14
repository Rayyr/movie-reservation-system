import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
} from "../controllers/movieController.js";

import { protect } from "../middlewares/authMiddleWare.js";
import { adminOnly } from "../middlewares/roleMiddleWare.js";

import express from 'express';

const router=express.Router();

//by authnaticated admins only
router.post("/create",protect,adminOnly,createMovie);

//by puplic
router.get("/getAll",getMovies);

//by puplic
router.get("/getOne/:id",getMovieById);

//by authnaticated admins only
router.put("/updateOne/:id",protect,adminOnly,updateMovieById);

//by authnaticated admins only
router.delete("/deleteOne/:id",protect,adminOnly,deleteMovieById);


export default router;