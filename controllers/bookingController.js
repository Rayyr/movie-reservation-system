import Booking from "../models/Booking";
import Seat from "../models/Seat";
import ShowTime from "../models/ShowTime";

//Get Available Seats for a Showtime
export const getAvailableSeats = async (req, res) => {
  try {
    const showTimdId = req.params.showTimeId;

    // 🎬 Get showtime → screen
    const showTime = await ShowTime.findById(showTimdId);

    if (!showTime) {
      return res.status(404).json({ message: "ShowTime not found" });
    }

    //  💺 All seats of this screen
    const seats = await Seat.find({ screen: showtime.screen });

    // ❌ Already booked seats

    const bookings = await Booking.find({
      showtime: showtimeId,
      status: "BOOKED",
    });

    const bookedSeatIds = bookings.flatMap((b) => b.seats);

    // ✅ Filter available seats
    const availableSeats = seats.filter(
      (seat) => !bookedSeatIds.includes(seat._id.toString()),
    );

    res.json(availableSeats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
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
    const showTimePrice = await ShowTime.findById(showTimeId).price;

    const totalPrice = showTimePrice * seatIds.length;

    const newBooking = await Booking.create({
      showTime: showTimeId,
      seats: seatsIds,
      totalPrice: totalPrice,
      user: req.user._id,
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
