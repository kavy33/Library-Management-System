import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

import { recordBorrowBook } from "../store/slices/borrowSlice";
import { bookImages } from "../utils/bookImages"; //img
import { bookCategories } from "../utils/bookCategories"; // ✅ categories



 
const BookManagement = () => {

  const dispatch = useDispatch();

  // 📌 Handle GET (Borrow) button click
const handleGetBook = (bookId) => {
  if (!user?.email) {
    toast.error("User email not found");
    return;
  }

  dispatch(recordBorrowBook(user.email, bookId));
};





    const {loading,error,message,books} = useSelector((state) => state.book);
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const {addBookPopup,readBookPopup,recordBookPopup} = useSelector((state) => state.popup);

    const {loading: borrowSliceLoading,
            error: borrowSliceError,
            message: borrowSliceMessage
    } = useSelector(state => state.borrow); 

    const [readBook, setReadBook] = useState({});
    const openReadPopup = (id) => {
      const book = books.find(book => book._id === id);
      setReadBook(book);
      dispatch(toggleReadBookPopup()); 
    };


    const [borrowBookId, setBorrowBookId] = useState("");
    const openRecordBookPopup = (bookId)=>{
      setBorrowBookId(bookId); 
      dispatch(toggleRecordBookPopup());
    };

    
    // ✅ FETCH BOOKS WHEN PAGE LOADS
useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchAllBooks());
  }
}, [dispatch, isAuthenticated]);


useEffect(() => {
  if (message || borrowSliceMessage) {
    toast.success(message || borrowSliceMessage);

    dispatch(fetchAllBooks());

    if (user?.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }

    dispatch(resetBookSlice());
    dispatch(resetBorrowSlice());
  }

  if (error || borrowSliceError) {
    toast.error(error || borrowSliceError);
    dispatch(resetBookSlice());
    dispatch(resetBorrowSlice());
  }
}, [
  message,
  error,
  borrowSliceMessage,
  borrowSliceError,
  dispatch,
  user?.role
]);

    const [searchedKeyword, setSearchedKeyword] = useState("");


 const [selectedCategory, setSelectedCategory] = useState("All");




    const handleSearch = (e)=>{
      setSearchedKeyword(e.target.value.toLowerCase());
    }







    // const searchedBooks = books.filter(book=>{
    //   return book.title.toLowerCase().includes(searchedKeyword);
    // })

const searchedBooks = books.filter((book) => {
  // 🔍 search filter
  const matchesSearch = book.title
    .toLowerCase()
    .includes(searchedKeyword);

  // 🏷 category filter
  const bookCategory = bookCategories[book.title] || "General";

  const matchesCategory =
    selectedCategory === "All" ||
    bookCategory === selectedCategory;

  return matchesSearch && matchesCategory;
});





  return <>
  <main className="relative flex-1 p-6 pt-28">
    <Header />
 {/* { Sub Header} */}
    <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <h2 className="text-xl font-medium md:text-2xl md:font-semibold ">
        {user && user.role === "Admin" ? "Book Management" : "Books" }</h2>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 ">
          {
            isAuthenticated && user?.role === "Admin" && (
              <button onClick={()=>dispatch(toggleAddBookPopup())} 
                      className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center 
                      items-center py-2 px-4  bg-black text-white rounded-md hover:bg-gray-800">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full
                                 text-black w-[25px] h-[25px] text-[27px] absolute left-5 ">+</span>Add Book</button>
            )
          }
          <input type="text"
                 placeholder="Search Books...."
                 className="w-full sm:w-52 border p-2 border-gray-300 rounded-md "
                 value={searchedKeyword}
                 onChange={handleSearch}/>


 <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="w-full sm:w-52 border p-2 rounded-md"
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
   {/* { Table} */}
    {books && books.length > 0 ? (
      <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
        <table className="min-w-full border-collapse ">
          <thead>
            <tr className="bg-gray-200">
               <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left ">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Author</th>
              {
                isAuthenticated && user?.role === "Admin" && ( <th className="px-4 py-2 text-left">Quantity</th>)
              }
               <th className="px-4 py-2 text-left">Price</th>
               <th className="px-4 py-2 text-left">Availability</th>

                {/* ✅ NEW COLUMN */}
                 {user?.role === "User" && (
                   <th className="px-4 py-2 text-center">Action</th>
                  )}



                {
                isAuthenticated && user?.role === "Admin" && ( <th className="px-4 py-2 text-center">Record Book</th>)
              }
                         
            </tr>
          </thead>
          <tbody>
            {
              searchedBooks.map((book, index) =>(
               <tr key={book._id} className={(index + 1 ) % 2 === 0 ? "bg-gray-50" : "" }>

         {/* 🖼 IMAGE COLUMN (NEW) */}
  <td className="px-4 py-2">
    <img
      src={bookImages[book.title] || "/book-placeholder.png"}
      alt={book.title}
      className=" w-24 h-36 
    object-cover 
    rounded-lg 
    shadow-md 
    transition-transform 
    duration-300 
    hover:scale-105"
    />
  </td>



                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.author}</td>
                 {
                isAuthenticated && user?.role === "Admin" && ( <td className="px-4 py-2">{book.quantity}</td>)
              }
              <td className="px-4 py-2">{`₹${book.price}`}</td>
                <td className="px-4 py-2">
                  {book.availability ? "Available" : "Unavailable"}
                  </td>

   {user?.role === "User" && (
  <td className="px-4 py-2 text-center">
    {book.availability ? (
      <button
        onClick={() => handleGetBook(book._id)}
        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
      >
        GET
      </button>
    ) : (
      <span className="text-gray-400 font-bold">-</span>
    )}
  </td>
)}



                  {/* <td className="px-4 py-2"></td> */}

                  {/* {
                isAuthenticated && user?.role === "Admin" && ( <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                  <BookA onClick={()=>openReadPopup(book._id)}/>
                    <NotebookPen onClick={()=>openRecordBookPopup(book._id)}/>
                </td>)
              } */}  


              {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2">
                     <div className="flex items-center justify-center gap-3">
                     <BookA
                           className="cursor-pointer hover:text-gray-600"
                            onClick={() => openReadPopup(book._id)}
                     />
               <NotebookPen
                      className="cursor-pointer hover:text-gray-600"
                      onClick={() => openRecordBookPopup(book._id)}
                    />
                   </div>
              </td>
           )}
               </tr>
              ))
              }
            
          </tbody>
        </table>
      </div>
      
    ): (
      <h3 className="text-3xl mt-5 font-medium">No books found in library </h3>
    )}
  </main>
  {addBookPopup && <AddBookPopup />} 
   {readBookPopup && <ReadBookPopup book={readBook}/>}
    {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>} 


  
  
  
  </>;
};


export default BookManagement;
