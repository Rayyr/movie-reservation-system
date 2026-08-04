import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import ShowTime from "../models/ShowTime.js";

//Get Available Seats for a Showtime
export const getSeatsStatus = async (req, res) => {
  try {
    const showTimeId = req.params.showTimeId;

    console.log(showTimeId);
    // 🎬 Get showtime → screen
    const showTime = await ShowTime.findById(showTimeId);
    console.log(showTime.screen);

    if (!showTime) {
      return res.status(404).json({ message: "ShowTime not found" });
    }

    //  💺 All seats of this screen which this showTime will be displayed on
    const seats = await Seat.find({ screen: showTime.screen }); //returns:array of objs

    // ❌ Already booked seats : returns array of objs bookings=[booking1,booking2...]
    const bookings = await Booking.find({
      showtime: showTimeId,
      status: "BOOKED",
    });

    //sxtract seats from each booking as this format : [seat1Obj,seat4Obj,...]
    const bookingSeats = bookings.flatMap((booknig) => {
      return booknig.seats;
    });

    //seatsWithStatus : array of objs : [{},{},..]
    const seatsWithStatus = seats.map((seat) => ({ 
      ...seat.toObject(),
      status: bookingSeats.includes(seat) ? "RESERVED" : "AVAILABLE",
    }));

    console.log(seatsWithStatus[0]);
    return res.status(200).json(seatsWithStatus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  /*  try {
    const { showTimeId, seatIds } = req.body;

    // 🔍 Check if seats already booked
    const existingBookings = await Booking.find({
      showTime: showTimeId,
      status: "BOOKED",
      seats: { $in: seatIds },
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Some seats are already booked" });
    }

    //get showtime price (per seat)
    const showTime  = await ShowTime.findById(showTimeId);
const showTimePrice = showTime.price;
    const totalPrice = showTimePrice * seatIds.length;

    const newBooking = await Booking.create({
      showTime: showTimeId,
      seats: seatIds,
      totalPrice: totalPrice,
      user: req.user._id,
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } */
};
