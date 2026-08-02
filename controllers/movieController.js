import Movie from "../models/Movie.js";


//basic CRUD ops for movie model


//create movie
export const createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return res.status(201).json(newMovie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get all movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({movies:movies});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get singke movie by id
export const getMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    } else return res.json(movie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update movie by id
export const updateMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    const newMovie = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(id, newMovie, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie ) {
      return res.status(404).json({ message: "Movie not found" });
    } else return res.status(200).json(updatedMovie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete movie by id
export const deleteMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    } else return res.status(200).json(deletedMovie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
