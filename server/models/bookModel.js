import { urlencoded } from "express";
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
    category: {
  type: String,
  required: true,
  enum: [
    "Programming",
    "Web Development",
    "Computer Science",
    "AI / ML",
    "Fiction",
    "Non-Fiction self-help",
    "Romance",
    "Biography",
    "General"
  ],
  default: "General",
},

 image: {
   public_id: String,
   url: String,
},

ratings: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBorrow: {
      type: Boolean,
      default: true,
    }
  },
],
averageRating: {
  type: Number,
  default: 0,
},
numReviews: {
  type: Number,
  default: 0,
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
bookSchema.index({ title: 1, author: 1 }, { unique: true });
export const Book = mongoose.model("Book", bookSchema);