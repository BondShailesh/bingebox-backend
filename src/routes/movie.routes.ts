import express from "express";
import { addMovie, getMovieById, getMovies } from "../controllers/movie.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", protect, getMovies);
router.post(
  "/add-movie",
  protect,
  adminOnly,
  addMovie
);
router.get("/:id", protect, getMovieById);

export default router;