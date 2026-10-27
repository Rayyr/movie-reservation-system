import ShowTime from "../models/ShowTime.js";
import Movie from "../models/Movie.js";
import Screen from "../models/Screen.js";

export const createShowTime = async (req, res) => {
  try {
    const { movie, screen, startTime, price } = req.body;
    const start = new Date(startTime);
    const ticketPrice = Number(price);

    if (!movie || !screen || Number.isNaN(start.getTime()) || !Number.isFinite(ticketPrice) || ticketPrice < 0) {
      return res.status(400).json({
        message: "Movie, screen, a valid start time, and a non-negative price are required",
      });
    }

    const movieX = await Movie.findById(movie);
    if (!movieX) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const selectedScreen = await Screen.findById(screen);
    if (!selectedScreen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const endTime = new Date(start.getTime() + movieX.duration_min * 60000);

    const existing = await ShowTime.findOne({
      screen: screen,
      startTime: { $lt: endTime },
      endTime: { $gt: start },
    });

    if (existing) {
      return res.status(400).json({
        message: "This screen already has a showtime in this time range",
      });
    }

    const showTime = await ShowTime.create({
      movie: movie,
      screen: screen,
      startTime: start,
      endTime: endTime,
      price: ticketPrice,
    });

    await showTime.populate({
      path: "screen",
      select: "name",
      populate: {
        path: "theater",
        select: "name location",
      },
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

    //console.log(movie_id);
    const showtimes = await ShowTime.find({ movie: movie_id })
      .populate({
        path: "screen",
        select: "name",//by default screen_id will be returned 
        populate: {
          path: "theater",
          select: "name location",
        },
      })
      .sort({ startTime: 1 });//ascending order A-Z by startTime prop

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
