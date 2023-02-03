import express from "express";
import { addMovie, getAllMovies, getMovieById } from "../controllers/movie-controller";
const movieRouter = express.Router();

movieRouter.get("/:id", getMovieById);
movieRouter.get("/", getAllMovies);
movieRouter.post("/add", addMovie);



export default movieRouter;