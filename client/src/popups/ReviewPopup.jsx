import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import API from "../utils/axiosConfig";
import { toast } from "react-toastify";

const ReviewPopup = ({ bookId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select rating between 1 and 5");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.put(
        `/api/v1/book/review/${bookId}`,
        {
          rating,
          comment,
        }
      );

      toast.success(data.message || "Review submitted successfully");

      setTimeout(() => {
        onClose();
      }, 700);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
    
    <div className="bg-white p-6 rounded w-96 shadow-lg relative">
      
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl transition"
      >
        <IoClose />
      </button>

      <h2 className="text-lg font-bold mb-4">Add Review</h2>

      {/* ⭐ STAR RATING UI */}
      <div className="flex gap-2 text-2xl mb-4">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;

          return (
            <FaStar
              key={index}
              className="cursor-pointer transition"
              color={
                starValue <= (hover || rating)
                  ? "#ffc107"
                  : "#e4e5e9"
              }
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>

      {/* COMMENT */}
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 w-full mt-2 rounded"
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-black text-white px-4 py-2 mt-4 rounded w-full"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

    </div>
  </div>
);
};

export default ReviewPopup;