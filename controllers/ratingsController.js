import Rating from "../models/Rating.js";
import Movie from "../models/Movie.js";

export const getIfUserRate = async (req, res) => {
  try {
    const movieID = req.params.movieID;
    const userId = req.user._id;

    const result = await Rating.findOne({
      movie: movieID,
      user: userId,
    });

    if (result)
      return res.status(200).json(true); //rated
    else return res.status(200).json(false); //not rated
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const submitRating = async (req, res) => {
  try {
    const movieID = req.params.movieID; //from params
    const userID = req.user._id; //from auth

    const  rating = req.body.rating;

    await Rating.create({
      movie: movieID,
      user: userID,
      value: rating,
    });

    //update movie vote_count and rating

    const movie = await Movie.findById(movieID);
    const totalRating = movie.rating + movie.vote_count;
    const newVoteCount = movie.vote_count + 1;
    const newAvgRating = (totalRating + rating) / newVoteCount;

    await Movie.updateOne(
      { _id: movieID },
      {
        rating: newAvgRating,
        vote_count: newVoteCount,
      },
    );

    return res.status(201).json({ message: "Rated Successdully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
