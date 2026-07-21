import mongoose from "mongoose";

//screen is a hall in theater
const screenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    theater: {//store a reference(Id)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Screen = mongoose.model("Screen", screenSchema);

export default Screen;
