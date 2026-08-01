import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true,
    },
   
     vote_avg:{
      type:Number,
      default:0
     },
      vote_count:{
      type:Number,
      default:0
     },
     language:{
      type:String,
      default:"english"
     },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",//admin(author)role 
      required: true,
    },
    duration_min: {
      type: Number,
      required: true,
      min: [1, "Duration must be positive"],
      validate: {
        validator: function (value) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: "Duration must have max 2 decimal places",
      },
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
