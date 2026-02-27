import React, { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import { FaStar } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const AdminReviewDashboard = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null); 

  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(rating || 0, 0), 5);

    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={
          i < safeRating ? "text-yellow-500" : "text-gray-300"
        }
      />
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/api/v1/book/review/${bookId}`);
        setBook(data.book || { ratings: [] });
      } catch (error) {
        console.error(error);
        setBook({ ratings: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg">
          Loading reviews...
        </div>
      </div>
    );
  }
  

const handleDelete = async () => {
  if (!selectedReviewId) return;

  try {
    await API.delete(
      `/api/v1/book/review/${bookId}/${selectedReviewId}`
    );

    toast.success("Review deleted");

    const updatedRatings = book.ratings.filter(
      (r) => r._id !== selectedReviewId
    );

    setBook({
      ...book,
      ratings: updatedRatings,
      numReviews: updatedRatings.length,
      averageRating:
        updatedRatings.length === 0
          ? 0
          : updatedRatings.reduce((acc, r) => acc + r.rating, 0) /
            updatedRatings.length,
    });

    setDeleteModal(false);
    setSelectedReviewId(null);

  } catch (error) {
    toast.error("Failed to delete review");
  }
};
  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-[800px] p-6 rounded-lg shadow-xl max-h-[600px] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Review Dashboard – {book?.title}
          </h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p>Total Reviews: {book?.numReviews || 0}</p>
          <div className="flex items-center gap-2">
            <span>
              Average Rating:{" "}
              {book?.averageRating
                ? book.averageRating.toFixed(1)
                : 0}
            </span>
            {renderStars(Math.round(book?.averageRating || 0))}
          </div>
        </div>

        {book?.ratings?.length === 0 && (
          <p className="text-center text-gray-500">
            No reviews yet
          </p>
        )}

{book?.ratings?.map((review) => (
  <div
    key={review._id}
    className="border rounded-xl p-4 mb-4 bg-white shadow-sm hover:shadow-md transition relative"
  >
    {/* Top Row */}
    <div className="flex justify-between items-start">

      {/* Left Section */}
      <div>
        <p className="font-semibold text-gray-800">
          {review.name}
        </p>

        <p className="text-xs text-gray-400">
          {review.createdAt
            ? new Date(review.createdAt).toLocaleString()
            : ""}
        </p>
      </div>

      {/* Right Section (Stars + Delete) */}
      <div className="flex items-center gap-4">

        {/* ⭐ Stars */}
        <div className="flex gap-1">
  {renderStars(review.rating)}
</div>

        {/* 🗑 Delete */}
        <button
          onClick={() => {
  setSelectedReviewId(review._id);
  setDeleteModal(true);
}}
          className="text-gray-400 hover:text-red-500 transition"
          title="Delete Review"
        >
          <Trash2 size={18} />
        </button>

      </div>
    </div>

    {/* Comment */}
    <p className="mt-3 text-gray-700">
      {review.comment}
    </p>

    {/* Verified */}
    {review.verifiedBorrow && (
      <span className="text-green-600 text-sm font-medium mt-2 inline-block">
        ✔ Verified Borrow
      </span>
    )}
  </div>
))}
      </div>
    </div>

    {deleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-[350px] shadow-xl">

      <h3 className="text-lg font-semibold text-gray-800">
        Delete Review
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete this review?
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setDeleteModal(false)}
          className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}
    </>

    
  );
};

export default AdminReviewDashboard;