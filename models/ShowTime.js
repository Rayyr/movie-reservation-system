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

    endTime: {//calculated from move duration
      type: Date,
      required: true,
    },
    price: {/* (per seat) */
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },

   // index: { screen: 1, startTime: 1 } // منع تكرار نفس العرض
  },
  { timestamps: true },
);

const ShowTime = mongoose.model("ShowTime", showTimeSchema);

export default ShowTime;
