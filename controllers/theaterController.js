import Theater from "../models/Theater.js";
import Screen from "../models/Screen.js";

export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ name: 1 });
    return res.status(200).json({ theaters });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTheater = async (req, res) => {
  try {
    const { location, name } = req.body;
    if (!name?.trim() || !location?.trim()) {
      return res.status(400).json({ message: "Theater name and location are required" });
    }

    const newTheater = await Theater.create({
      location: location.trim(),
      name: name.trim(),
    });

    return res.status(201).json({
      _id: newTheater._id,
      name: newTheater.name,
      location: newTheater.location,

      message: "Registered successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A theater with this name already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const hasScreens = await Screen.exists({ theater: theater._id });
    if (hasScreens) {
      return res.status(409).json({
        message: "Delete this theater's screens before deleting the theater",
      });
    }

    await Theater.findByIdAndDelete(theater._id);
    return res.status(200).json({ message: "Theater deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
