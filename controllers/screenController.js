import Screen from "../models/Screen.js";
import Seat from "../models/Seat.js";
import Theater from "../models/Theater.js";
import ShowTime from "../models/ShowTime.js";

export const createScreen = async (req, res) => {
  try {
    const { name, theater, rows, seatsPerRow } = req.body;
    const rowCount = Number(rows);
    const seatsPerRowCount = Number(seatsPerRow);

    if (
      !name?.trim() ||
      !theater ||
      !Number.isInteger(rowCount) ||
      rowCount < 1 ||
      rowCount > 26 ||
      !Number.isInteger(seatsPerRowCount) ||
      seatsPerRowCount < 1
    ) {
      return res.status(400).json({
        message: "Name, theater, 1–26 rows, and a positive seats-per-row count are required",
      });
    }

    const theaterExists = await Theater.findById(theater);
    if (!theaterExists) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const newScreen = await Screen.create({
      name: name.trim(),
      theater,
      totalSeats: rowCount * seatsPerRowCount,
    });

    const seats = [];
    for (let row = 1; row <= rowCount; row++) {
      for (let number = 1; number <= seatsPerRowCount; number++) {
        seats.push({
          screen: newScreen._id,
          row: String.fromCodePoint(64 + row),
          number,
        });
      }
    }

    await Seat.insertMany(seats);
    await newScreen.populate("theater", "name location");

    res.status(201).json({
      newScreen,
      message: "Screen and seats created",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteScreenById = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const hasShowtimes = await ShowTime.exists({ screen: screen._id });
    if (hasShowtimes) {
      return res.status(409).json({
        message: "Delete this screen's scheduled showtimes before deleting the screen",
      });
    }

    await Seat.deleteMany({ screen: screen._id });
    await Screen.findByIdAndDelete(screen._id);

    return res.status(200).json({ message: "Screen and its seats deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find()
      .populate("theater", "name location")
      .sort({ name: 1 });

    return res.status(200).json({ screens });
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
