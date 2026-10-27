import Theater from "../models/Theater.js";

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
    const newTheater = await Theater.create({
      location: location,
      name: name,
    });

    return res.status(201).json({
      _id: newTheater._id,
      name: newTheater.name,
      location: newTheater.location,

      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
