import Screen from "../models/Screen.js";
import Seat from "../models/Seat.js";

//make it atomic 
export const createScreen = async (req, res) => {
  try {
    const { name, theater, rows, seatsPerRow } = req.body;

    let totalSeats = Number(rows) * Number(seatsPerRow);

    const newScreen = await Screen.create({
      name,
      theater,
      totalSeats,
    });

    //Create seats automatically
    const seats = [];
    for (let row = 1; row <= Number(rows); row++) {
      for (let number = 1; number <= Number(seatsPerRow); number++) {
        Seat.create({
          screen: newScreen._id,
          row:String.fromCodePoint(65+(row-1)) ,
          number
        });
      }
    }


    

    res.status(201).json({
      newScreen,
      message: "Screen and seats created",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getScreenSeats = async (req, res) => {
  try {
    const id = req.params.id;

    const seats = await Seat.find({
      screen: id,
    });

    if (!seats) {
      return res.status(404).json({ message: "Screen not found" });
    } else {
      return res.json(seats);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
