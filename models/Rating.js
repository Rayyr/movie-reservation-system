import mongoose from "mongoose";

const ratingSchema=new mongoose.Schema({
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true});

const Rating=mongoose.model("Rating",ratingSchema);

export default Rating;

