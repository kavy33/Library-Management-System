import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBook } from "../store/slices/bookSlice";

const EditBookPopup = ({ book, close }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: book.title || "",
    author: book.author || "",
    price: book.price || "",
    quantity: book.quantity || "",
    category: book.category || "",
    description: book.description || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(updateBook(book._id, formData));
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-[90%] max-w-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-semibold mb-6">Edit Book</h2>

        {/* Title */}
        <label className="block mb-1 font-medium">Book Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-4 focus:outline-none"
        />

        {/* Author */}
        <label className="block mb-1 font-medium">Book Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-4 focus:outline-none"
        />

        {/* Price */}
        <label className="block mb-1 font-medium">
          Book Price (Price for borrowing)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-4 focus:outline-none"
        />

        {/* Quantity */}
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-4 focus:outline-none"
        />

        {/* Category */}
        <label className="block mb-1 font-medium">Book Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-4 focus:outline-none"
        >
          <option value="Programming">Programming</option>
          <option value="Web Development">Web Development</option>
          <option value="AI / ML">AI / ML</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction self-help">Non-Fiction self-help</option>
          <option value="Romance">Romance</option>
          <option value="Biography">Biography</option>
        </select>

        {/* Description */}
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border-2 border-black rounded-md px-4 py-2 mb-6 focus:outline-none"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={close}
            className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookPopup;
