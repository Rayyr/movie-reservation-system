import ShowTime from "../models/ShowTime";
import Movie from "../models/Movie";

export const createShowTime = async (req, res) => {
  try {
    const { movie, screen, startTime, endTime, price } = req.body;

    //validate time
    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

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

//get all showtimes
export const getAllShowTimes = async (req, res) => {
  try {
    const showTimes = await ShowTime.find()
      .populate("movie")
      .populate({
        path: "screen",
        populate: { path: "theater" },
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
