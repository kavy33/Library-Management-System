import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-wide">
            Book Details
          </h2>
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="text-xl hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* BOOK IMAGE */}
            <div className="flex justify-center md:justify-start">
              <img
                src={book.image?.url || "/book-placeholder.png"}
                alt={book.title}
                className="w-40 h-56 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* BOOK MAIN INFO */}
            <div className="flex-1 space-y-3">

              <h3 className="text-2xl font-bold text-gray-800">
                {book.title}
              </h3>

              <p className="text-gray-600 text-md">
                by <span className="font-semibold">{book.author}</span>
              </p>

              {/* BADGES */}
              <div className="flex flex-wrap gap-3 mt-2">

                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                  {book.category}
                </span>

                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
                  ₹ {book.price}
                </span>

                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    book.availability
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {book.availability ? "Available" : "Unavailable"}
                </span>

              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Description
            </h4>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border">
              {book.description}
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 bg-gray-100">
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReadBookPopup;