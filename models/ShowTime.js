import mongoose from "mongoose";

const showTimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },
    price: {/* (per seat) */
      type: Number,
      required: true,
      min: [, "Price must be positive"],
    },
  },
  { timestamps: true },
);

const ShowTime = mongoose.model("ShowTime", showTimeSchema);

export default ShowTime;
