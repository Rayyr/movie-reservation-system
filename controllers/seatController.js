import Seat from "../models/Seat.js";

export const getSeatsForScreen = async (req, res) => {
  try {
    const screenID = req.params.screenID;

    const seats = await Seat.find({ screen: screenID });

    //impossiple since in validation process of screen creattion we will ensure that there is
    if (seats.length === 0) {
      return res
        .status(200)
        .json({ message: "No seats are exist for this screen" });
    }

    //group them by row
    /*         {
  "rows": {
    "A": [ {seat1}, {seat2} ],
    "B": [ {seat3}, {seat4} ]
  }
} */

    const rows = {};
    seats.forEach((seat) => {
      if (!rows[seat.row]) rows[seat.row] = [];
       rows[seat.row].push(seat);
    });
    console.log(rows);
    return res.status(200).json({
      rows
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
