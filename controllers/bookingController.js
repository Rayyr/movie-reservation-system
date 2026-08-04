import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import ShowTime from "../models/ShowTime.js";

//Get Available Seats for a Showtime
export const getSeatsStatus = async (req, res) => {
  try {
    const showTimeId = req.params.showTimeId;

    //console.log(showTimeId);
    // 🎬 Get showtime → screen
    const showTime = await ShowTime.findById(showTimeId);
   // console.log(showTime.screen);

   //redundant since we will reach this api after chain of other apis so this is not the entry one 
    if (!showTime) {
      return res.status(404).json({ message: "ShowTime not found" });
    }

    //  💺 All seats of this screen which this showTime will be displayed on
    const seats = await Seat.find({ screen: showTime.screen }); //returns:array of objs

    // ❌ Already booked seats : returns array of objs bookings=[booking1,booking2...]
    const bookings = await Booking.find({
      showTime: showTimeId,
      status: "BOOKED",
    });

        //extract seats from each booking as this format : [{seat1Id},{seat4Id},...]
    const bookingSeats = new Set(
  bookings.flatMap((b) => b.seats.map((s) => s.toString()))
);

    //seatsWithStatus : array of objs : [{},{},..]
const seatsWithStatus = seats.map((seat) => ({
  ...seat.toObject(),
  status: bookingSeats.has(seat._id.toString())
    ? "RESERVED"
    : "AVAILABLE",
}));
 
     
   // console.log(seatsWithStatus[0]);
    return res.status(200).json(seatsWithStatus);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createBooking=async(req,res)=>{

  try{

    //all needed info will be passed in req.body
    //user,showTime,seats passed as ids (since they are fks)
    const {user,showTime,seats}=req.body;
    //seats : of course they are available not reserved 
    //all vars are being validated while they are being rendered to user 

    console.log(showTime);
    console.log(seats[0]);
    const showTimeContent=await ShowTime.findById(showTime);
    const totalPrice= seats.length*showTimeContent.price//price*seats_length
   
    const newBooking=await Booking.create({
      user:user,
      showTime:showTime,
     
      seats:seats,
      totalPrice:totalPrice,
      status:"BOOKED"
    });
    return res.status(201).json({message:"Your booking has been assigned succesfully",newBooking});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
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
  } 
};*/
