import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const editProfile = async (req, res) => {
  try {
    const user_id = req.user_id; //comes from protect middleware

    const new_username = req.body.username;
    const new_password = req.body.password;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!new_username && !new_password) {
      return res.status(400).json({
        message: "Please provide a username or password to update",
      });
    }

    user.username = new_username;
    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    return res
      .status(200)
      .json({ message: "User information has been updated succefully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
