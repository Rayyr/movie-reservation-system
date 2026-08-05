import Rating from "../models/Rating.js";

export const getIfUserRate = async (req, res) => {
  try {
    //movieID from req.params , user from req.body
    const movieID = req.params.movieID; //id
    const user = req.body.user; //user obj

    const result = await Rating.find({
      movie: movieID,
      user: user._id,
    });

    if (!result) {
      return res.status(200).json(false); //true=res.data
    } else return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
