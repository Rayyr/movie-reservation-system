import ShowTime from "../models/ShowTime.js";
import Movie from "../models/Movie.js";

export const createShowTime = async (req, res) => {
  try {
    //movie,scree, : IDs (FKs)
    const { movie, screen, startTime, price } = req.body;

    /*    //validate time
    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    } */

    const movieX = await Movie.findById(movie);

    const start = new Date(startTime);

    const endTime = new Date(start.getTime() + movieX.duration_min * 60000);

    //check if there is other movie at same screen or at same time
    const existing = await ShowTime.findOne({
      screen: screen,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (existing) {
      return res.status(400).json({
        message: "This screen already has a showtime in this time range",
      });
    }

    const showTime = await ShowTime.create({
      movie: movie,
      screen: screen,
      startTime: startTime,
      endTime: endTime,
      price: price,
    });

    return res.status(201).json(showTime);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get all showtimes of movie
export const getMovieShowTimes = async (req, res) => {
  try {
    const movie_id = req.params.movieID;

    console.log(movie_id);
    const showtimes = await ShowTime.find({ movie: movie_id })
      .populate({
        path: "screen",
        select: "name",//by default screen_id will be returned 
        populate: {
          path: "theater",
          select: "name location",
        },
      })
      .sort({ startTime: 1 });

    res.status(200).json({
      showtimes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/* 
//get showtimes by movie name
export const getShowTimesByMovieTilte = async (req, res) => {
  try {
    const movieTitle = req.params.title;

    // 🔍 Find movie by name (case-insensitive)
    const movie = await Movie.findOne({
      title: { $regex: movieTitle, $options: "i" },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const matchedShowTimes = await ShowTime.find({
      movie: movie._id,
    })
      .populate("movie")
      .populate({
        path: "screen",
        populate: { path: "theater" },
      });

    return res.json(matchedShowTimes);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
 */
