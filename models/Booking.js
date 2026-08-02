import mongoose  from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    seats:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    }],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },
  },
  { timestamps: true },
);

const Booking =  mongoose.model("Booking", bookingSchema);
export default Booking;
