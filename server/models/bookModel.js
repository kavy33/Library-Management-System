import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        required: true
    },
    availability:{
        type: Boolean,
        default: true
    },
    category:{
        type: String,
        default: "General",
        
    },
    waitingQueue: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

},{
    timestamps: true,
});
export const Book = mongoose.model("Book", bookSchema);