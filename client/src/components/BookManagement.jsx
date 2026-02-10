// import React, { useEffect, useState } from "react";
// import { BookA, NotebookPen, Trash2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   toggleAddBookPopup,
//   toggleReadBookPopup,
//   toggleRecordBookPopup,
// } from "../store/slices/popUpSlice";
// import { toast } from "react-toastify";
// import {
//   fetchAllBooks,
//   resetBookSlice,
//   deleteBook,
// } from "../store/slices/bookSlice";
// import {
//   fetchAllBorrowedBooks,
//   resetBorrowSlice,
//   recordBorrowBook,
// } from "../store/slices/borrowSlice";
// import Header from "../layout/Header";
// import AddBookPopup from "../popups/AddBookPopup";
// import ReadBookPopup from "../popups/ReadBookPopup";
// import RecordBookPopup from "../popups/RecordBookPopup";
// import { bookImages } from "../utils/bookImages";
// import { bookCategories } from "../utils/bookCategories";

// const BookManagement = () => {
//   const dispatch = useDispatch();

//   const { books, loading, error, message } = useSelector(
//     (state) => state.book
//   );
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const {
//     addBookPopup,
//     readBookPopup,
//     recordBookPopup,
//   } = useSelector((state) => state.popup);

//   const {
//     message: borrowMessage,
//     error: borrowError,
//   } = useSelector((state) => state.borrow);

//   const [readBook, setReadBook] = useState(null);
//   const [borrowBookId, setBorrowBookId] = useState("");
//   const [searchedKeyword, setSearchedKeyword] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   /* ---------------- FETCH BOOKS ---------------- */
//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(fetchAllBooks());
//     }
//   }, [dispatch, isAuthenticated]);

//   /* ---------------- TOAST HANDLING ---------------- */
//   useEffect(() => {
//     if (message || borrowMessage) {
//       toast.success(message || borrowMessage);

//       dispatch(fetchAllBooks());

//       if (user?.role === "Admin") {
//         dispatch(fetchAllBorrowedBooks());
//       }

//       dispatch(resetBookSlice());
//       dispatch(resetBorrowSlice());
//     }

//     if (error || borrowError) {
//       toast.error(error || borrowError);
//       dispatch(resetBookSlice());
//       dispatch(resetBorrowSlice());
//     }
//   }, [message, error, borrowMessage, borrowError, dispatch, user?.role]);

//   /* ---------------- HANDLERS ---------------- */

//   const handleGetBook = (bookId) => {
//     if(!bookId) {
//       toast.error("Invalid book ID");
//       return;
//     }
//     if(!user?.email) {
//       toast.error("User email not found. Please log in again.");
//       return;
//     }
//     dispatch(recordBorrowBook(bookId, user?.email));
//   };

//   const openReadPopup = (id) => {
//     const book = books.find((b) => b._id === id);
//     setReadBook(book);
//     dispatch(toggleReadBookPopup());
//   };

//   const openRecordBookPopup = (id) => {
//     setBorrowBookId(id);
//     dispatch(toggleRecordBookPopup());
//   };

//   const handleDeleteBook = (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this book?"
//     );
//     if (confirmDelete) {
//       dispatch(deleteBook(id));
//     }
//   };

//   /* ---------------- SEARCH + CATEGORY ---------------- */
//   const searchedBooks = books.filter((book) => {
//     const matchesSearch = book.title
//       .toLowerCase()
//       .includes(searchedKeyword.toLowerCase());

//     const bookCategory =
//       bookCategories[book.title] || "General";

//     const matchesCategory =
//       selectedCategory === "All" ||
//       bookCategory === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <>
//       <main className="relative flex-1 p-6 pt-28">
//         <Header />

//         {/* HEADER */}
//         <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
//           <h2 className="text-2xl font-semibold">
//             {user?.role === "Admin" ? "Book Management" : "Books"}
//           </h2>

//           <div className="flex flex-col lg:flex-row gap-4">
//             {user?.role === "Admin" && (
//               <button
//                 onClick={() => dispatch(toggleAddBookPopup())}
//                 className="bg-black text-white px-4 py-2 rounded-md"
//               >
//                 + Add Book
//               </button>
//             )}

//             <input
//               type="text"
//               placeholder="Search Books..."
//               className="border p-2 rounded-md"
//               value={searchedKeyword}
//               onChange={(e) => setSearchedKeyword(e.target.value)}
//             />

//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="border p-2 rounded-md"
//             >
//               <option value="All">All Categories</option>
//               <option value="Programming">Programming</option>
//               <option value="Web Development">Web Development</option>
//               <option value="AI / ML">AI / ML</option>
//               <option value="Computer Science">
//                 Computer Science
//               </option>
//               <option value="Fiction">Fiction</option>
//               <option value="Romance">Romance</option>
//               <option value="Biography">Biography</option>
//             </select>
//           </div>
//         </header>

//         {/* TABLE */}
//         <div className="mt-6 bg-white rounded shadow overflow-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-2">Image</th>
//                 <th className="px-4 py-2">ID</th>
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Author</th>
//                 {user?.role === "Admin" && (
//                   <th className="px-4 py-2">Quantity</th>
//                 )}
//                 <th className="px-4 py-2">Price</th>
//                 <th className="px-4 py-2">Availability</th>
//                 <th className="px-4 py-2 text-center">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {searchedBooks.map((book, index) => (
//                 <tr key={book._id} className="border-t">
//                   <td className="px-4 py-2">
//                     <img
//                       src={
//                         bookImages[book.title] ||
//                         "/book-placeholder.png"
//                       }
//                       className="w-20 h-28 object-cover rounded"
//                     />
//                   </td>
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2">{book.title}</td>
//                   <td className="px-4 py-2">{book.author}</td>
//                   {user?.role === "Admin" && (
//                     <td className="px-4 py-2">
//                       {book.quantity}
//                     </td>
//                   )}
//                   <td className="px-4 py-2">₹{book.price}</td>
//                   <td className="px-4 py-2">
//                     {book.availability
//                       ? "Available"
//                       : "Unavailable"}
//                   </td>

//                   {/* ACTIONS */}
//                   <td className="px-4 py-2">
//                     <div className="flex justify-center gap-4">
//                       {user?.role === "User" &&
//                         book.availability && (
//                           <button
//                             onClick={() =>
//                               handleGetBook(book._id)
//                             }
//                             className="bg-black text-white px-3 py-1 rounded"
//                           >
//                             GET
//                           </button>
//                         )}

//                       {user?.role === "Admin" && (
//                         <>
//                           <BookA
//                             onClick={() =>
//                               openReadPopup(book._id)
//                             }
//                             className="cursor-pointer"
//                           />
//                           <NotebookPen
//                             onClick={() =>
//                               openRecordBookPopup(book._id)
//                             }
//                             className="cursor-pointer"
//                           />
//                           <Trash2
//                             onClick={() =>
//                               handleDeleteBook(book._id)
//                             }
//                             className="cursor-pointer text-red-600"
//                           />
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {addBookPopup && <AddBookPopup />}
//       {readBookPopup && <ReadBookPopup book={readBook} />}
//       {recordBookPopup && (
//         <RecordBookPopup bookId={borrowBookId} />
//       )}
//     </>
//   );
// };

// export default BookManagement;





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
import { bookImages } from "../utils/bookImages";
import { bookCategories } from "../utils/bookCategories";
import { useNavigate } from "react-router-dom";

const BookManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, loading, error, message } = useSelector(
    (state) => state.book
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } =
    useSelector((state) => state.popup);

  const { message: borrowMessage, error: borrowError } =
    useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState(null);
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ---------------- FETCH BOOKS ---------------- */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllBooks());
    }
  }, [dispatch, isAuthenticated]);

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

  /* ---------------- GET BOOK (FIXED) ---------------- */
  const handleGetBook = (bookId) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    // 🔐 Deposit check
    if (!user.depositPaid) {
      toast.error("Please pay ₹1000 security deposit first");
      navigate("/deposit"); // 👈 your Razorpay page
      return;
    }

    // 🚫 Max 3 books check
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

  const openRecordBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  /* ---------------- SEARCH + CATEGORY ---------------- */
  const searchedBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());

    const bookCategory = bookCategories[book.title] || "General";

    const matchesCategory =
      selectedCategory === "All" || bookCategory === selectedCategory;

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
                <th className="px-4 py-2">#</th>
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
                      src={bookImages[book.title] || "/book-placeholder.png"}
                      className="w-20 h-28 object-cover rounded"
                      alt={book.title}
                    />
                  </td>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>

                  {user?.role === "Admin" && (
                    <td className="px-4 py-2">{book.quantity}</td>
                  )}

                  <td className="px-4 py-2">₹{book.price}</td>
                  <td className="px-4 py-2">
                    {book.availability ? "Available" : "Unavailable"}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-4">
                      {user?.role === "User" && book.availability && (
                        <button
  onClick={() => handleGetBook(book._id)}
  className={`px-3 py-1 rounded text-white ${
    !user.depositPaid || user.rentedBooks.length >= 3
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black"
  }`}
>
  GET
</button>
                      )}

                      {user?.role === "Admin" && (
                        <>
                          <BookA
                            onClick={() => openReadPopup(book._id)}
                            className="cursor-pointer"
                          />
                          <NotebookPen
                            onClick={() => openRecordBookPopup(book._id)}
                            className="cursor-pointer"
                          />
                          <Trash2
                            onClick={() => handleDeleteBook(book._id)}
                            className="cursor-pointer text-red-600"
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

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;

