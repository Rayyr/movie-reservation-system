import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      match: [
        /^[a-zA-Z][a-zA-Z0-9]*$/,
        "Username must not contain special characters or start with them",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/@gmail\.com$/, "Please enter valid email : example@gmail.com"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 charcters"],
      validate: {
        validator: function (value) {
          if (!this.username || !value) return true;
          return !value.toLowerCase().includes(this.username.toLowerCase());
        },
        message: "Password nust not contain username",
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
