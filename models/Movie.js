import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration_min: {
      type: Number,
      required: true,
      min: [1, "Duration must be positive"],
      validate: {
        validator: function (value) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: "Duration must have max 2 decimal places",
      },
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
