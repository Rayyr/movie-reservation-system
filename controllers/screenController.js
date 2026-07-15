import Screen from "../models/Screen.js";
import Seat from "../models/Seat";

export const createScreen = async (req, res) => {
  try {
    const { name, theater, rows, seatsPerRow } = req.body;

    let totalSeats = Number(rows) * Number(seatsPerRow);

    const screen = await Screen.create({
      name,
      theater,
      totalSeats,
    });

    //Create seats automatically
    const seats = [];
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push({
          screen: screen._id,
          row,
          number: i,
        });
      }
    });

    await Seat.insertMany(seats);

    res.status(201).json({
      screen,
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
