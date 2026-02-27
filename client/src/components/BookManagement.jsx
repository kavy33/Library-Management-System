import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import {
  fetchAllBooks,
  resetBookSlice,
  deleteBook,
} from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
  recordBorrowBook,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import EditBookPopup from "../popups/EditBookPopup";
import ReviewPopup from "../popups/ReviewPopup";
import AdminReviewDashboard from "../components/AdminReviewDashboard";
import { useNavigate } from "react-router-dom";

const BookManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, error, message } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } =
    useSelector((state) => state.popup);
  const { message: borrowMessage, error: borrowError } =
    useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState(null);
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editBook, setEditBook] = useState(null);
  const [editPopup, setEditPopup] = useState(false);
  //delete book modal
  const [deleteBookModal, setDeleteBookModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // USER Review
  const [reviewPopup, setReviewPopup] = useState(false);
  const [reviewBookId, setReviewBookId] = useState(null);

  // ADMIN Review
  const [adminReviewPopup, setAdminReviewPopup] = useState(false);
  const [adminReviewBookId, setAdminReviewBookId] = useState(null);

  /* ---------------- FETCH BOOKS ---------------- */
  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  /* ---------------- TOAST HANDLING ---------------- */
  useEffect(() => {
    if (message || borrowMessage) {
      toast.success(message || borrowMessage);
      dispatch(fetchAllBooks());

      if (user?.role === "Admin") {
        dispatch(fetchAllBorrowedBooks());
      }

      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowError) {
      toast.error(error || borrowError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [message, error, borrowMessage, borrowError, dispatch, user?.role]);

  /* ---------------- GET BOOK ---------------- */
  const handleGetBook = (bookId) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (user?.wallet?.securityDeposit < 1000) {
  toast.error("Please pay ₹1000 security deposit first");
  navigate("/deposit");
  return;
}

    if (user.rentedBooks?.length >= 3) {
      toast.error("You can rent only 3 books at a time");
      return;
    }

    dispatch(recordBorrowBook(bookId));
  };

  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

 const confirmDeleteBook = () => {
  if (!selectedBookId) return;

  dispatch(deleteBook(selectedBookId));

  setDeleteBookModal(false);
  setSelectedBookId(null);
};

  const searchedBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-2xl font-semibold">
            {user?.role === "Admin" ? "Book Management" : "Books"}
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            {user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                + Add Book
              </button>
            )}

            <input
              type="text"
              placeholder="Search Books..."
              className="border p-2 rounded-md"
              value={searchedKeyword}
              onChange={(e) => setSearchedKeyword(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="All">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction self-help">
                Non-Fiction self-help
              </option>
              <option value="Romance">Romance</option>
              <option value="Biography">Biography</option>
            </select>
          </div>
        </header>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Author</th>
                {user?.role === "Admin" && (
                  <th className="px-4 py-2">Quantity</th>
                )}
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {searchedBooks.map((book, index) => (
                <tr key={book._id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={book.image?.url || "/book-placeholder.png"}
                      className="w-20 h-28 object-cover rounded cursor-pointer hover:scale-105 transition"
                      alt={book.title}
                      onClick={() => openReadPopup(book._id)}
                    />
                  </td>

                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{book.title}</td>
                  <td className="px-4 py-2 text-center">{book.author}</td>

                  {user?.role === "Admin" && (
                    <td className="px-4 py-2 text-center">
                      {book.quantity}
                    </td>
                  )}

                  <td className="px-4 py-2 text-center">₹{book.price}</td>

                  <td className="px-4 py-2 text-center">
                    {book.availability ? "Available" : "Unavailable"}
                    {!book.availability && (
                      <p className="text-sm text-red-500">
                        {book.waitingQueue?.length || 0} waiting
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center gap-2">

                      {/* USER SIDE */}
                      {user?.role !== "Admin" && (
                        <>
                          {book.availability ? (
                            <button
                              onClick={() => handleGetBook(book._id)}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white shadow-sm hover:shadow-md transition"
>
                            
                              GET
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGetBook(book._id)}
                              className="bg-gray-600 text-white px-3 py-1 rounded"
                            >
                              Join Waiting List
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if(!user){
                                toast.error("Please login first");
                                navigate("/login");
                                return;
                              }
                              setReviewBookId(book._id);
                              setReviewPopup(true);
                            }}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                          >
                            Add Review
                          </button>
                        </>
                      )}
                       <button
                            onClick={() => {
                              setAdminReviewBookId(book._id);
                              setAdminReviewPopup(true);
                            }}
                           className="px-4 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"                          >
                            View Reviews
                          </button>


                      {/* ADMIN SIDE */}
                      {user?.role === "Admin" && (
                        <>
                         
                          <BookA
                            onClick={() => openReadPopup(book._id)}
                            className="cursor-pointer"
                          />
                          <NotebookPen
                            onClick={() => {
                              setEditBook(book);
                              setEditPopup(true);
                            }}
                            className="cursor-pointer text-blue-600"
                          />
                          <Trash2
                              onClick={() => {
                                    setSelectedBookId(book._id);
                                    setDeleteBookModal(true);
                            }}
                                className="cursor-pointer text-gray-400 hover:text-red-500 transition"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* POPUPS */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
      {editPopup && (
        <EditBookPopup
          book={editBook}
          close={() => setEditPopup(false)}
        />
      )}

      {/* USER REVIEW */}
      {reviewPopup && (
        <ReviewPopup
          bookId={reviewBookId}
          onClose={() => setReviewPopup(false)}
        />
      )}

      {/* ADMIN REVIEW */}
     {adminReviewPopup && (
  <AdminReviewDashboard
    bookId={adminReviewBookId}
    onClose={() => setAdminReviewPopup(false)}
  />
)}

{deleteBookModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl">

      <h3 className="text-lg font-semibold text-gray-800">
        Delete Book
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete this book?
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setDeleteBookModal(false)}
          className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={confirmDeleteBook}
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

export default BookManagement;