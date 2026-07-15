import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },
    row: {
      row: String, //A,B
      required: true,
      uppercase:true,
     match:[/^[A-Z]$/,"Row must be 1 letter"]
    },
    number: {
      type: Number, // 1,2,3...
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
