import Rating from "../models/Rating.js";

export const getIfUserRate = async (req, res) => {
  try {
    const movieID = req.params.movieID;
    const userId = req.user._id;

    

    const result = await Rating.findOne({
      movie: movieID,
      user: userId,
    });

    if(result)
    return res.status(200).json(true);//rated 

    else return res.status(200).json(false);//not rated 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
