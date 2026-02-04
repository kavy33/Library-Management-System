import React, { useEffect, useState } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { useLocation } from "react-router-dom";



import { bookImages } from "../utils/bookImages"; //img
import { bookCategories } from "../utils/bookCategories";//categories





const MyBorrowedBooks = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup} = useSelector(state => state.popup);

   const [readBook, setReadBook] = useState({});
      const openReadPopup = (id) => {
        const book = books.find(book => book._id === id);
        setReadBook(book);
        dispatch(toggleReadBookPopup()); 
      };

      // ✅ FETCH BORROWED BOOKS ON PAGE LOAD
useEffect(() => {
  dispatch(fetchUserBorrowedBooks());
}, [dispatch]);



    const [searchedKeyword, setSearchedKeyword] = useState("");//search in borrowed page
     const [selectedCategory, setSelectedCategory] = useState("All");
       const handleSearch = (e)=>{
      setSearchedKeyword(e.target.value.toLowerCase());
    }




    // const searchedBooks = books.filter((book) => {
    //   // 🔍 search filter
    //   const matchesSearch = book.title
    //     .toLowerCase()
    //     .includes(searchedKeyword);
    
    //   // 🏷 category filter
    //   const bookCategory = bookCategories[book.title] || "General";
    
    //   const matchesCategory =
    //     selectedCategory === "All" ||
    //     bookCategory === selectedCategory;
    
    //   return matchesSearch && matchesCategory;
    // });






        const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1 ).padStart(2, "0")}-${String(date.getFullYear())}`;

  const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    const result = `${formattedDate} ${formattedTime}`;
    return result;
 
 
  };

 const [filter, setFilter] = useState(
  location.state?.defaultTab || "returned"
);


  const returnedBooks = userBorrowedBooks?.filter(book=>{
    return book.returned === true;
  });
    const nonReturnedBooks = userBorrowedBooks?.filter(book=>{
    return book.returned === false;
  });

  // const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;
  
const baseBooks =
  filter === "returned" ? returnedBooks : nonReturnedBooks;

const booksToDisplay = baseBooks.filter((book) => {
  // 🔍 SEARCH
  const matchesSearch = book.bookTitle
    .toLowerCase()
    .includes(searchedKeyword);

  // 🏷 CATEGORY
  const bookCategory =
    bookCategories[book.bookTitle] || "General";

  const matchesCategory =
    selectedCategory === "All" ||
    bookCategory === selectedCategory;

  return matchesSearch && matchesCategory;
});








  return <>
  <main className="relative flex-1 p-6 pt-28 ">
    <Header/>
{/* { Sub header} */}
     <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      <h2 className="text-xl font-medium md:text-2xl md:font-semibold">Borrowed Books</h2>
    
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">


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

     <header className="flex flex-col gap-3 sm:flex-row md:items-center">
      <button className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72
             ${filter === "returned" ? "bg-black text-white border-black"
             : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
      }`} onClick={()=>setFilter("returned")}>Returned Books</button>

        <button 
             className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72
             ${filter === "nonReturned" ? "bg-black text-white border-black"
             : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
      }`} onClick={()=>setFilter("nonReturned")}>Non-Returned Books</button>
     </header>
     {
      booksToDisplay && booksToDisplay.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg ">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 ">
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Book Title</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Returned</th>
                <th className="px-4 py-2 text-left">View</th>

              </tr>
            </thead>
            <tbody>
              {
                booksToDisplay.map((book, index)=>(
                  <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  > 

         <td className="px-4 py-2">
           <img
             src={bookImages[book.bookTitle] || "/book-placeholder.png"}
             alt={book.bookTitle}
             className=" w-24 h-36 
           object-cover 
           rounded-lg 
           shadow-md 
           transition-transform 
           duration-300 
           hover:scale-105"
           />
         </td>



                    <td className="px-4 py-2 ">{index + 1}</td>
                      <td className="px-4 py-2 ">{book.bookTitle}</td>
                        <td className="px-4 py-2 ">{formatDate(book.borrowedDate)}</td>
                          <td className="px-4 py-2 ">{formatDate(book.dueDate)}</td>
                            <td className="px-4 py-2 ">{book.returned ? "Yes" : "No"}</td>
                              <td className="px-4 py-2 "><BookA onClick={()=> openReadPopup(book.bookId)}/></td>
                    

                  </tr>
                  
                ))
              }
            </tbody>
          </table>
        </div>
      ) : filter === "returned" ? (<h3 className="text-3xl mt-5 font-medium ">No Returned Books Found!</h3>) :
            (
            <h3 className="text-3xl mt-5 font-medium ">No Non-Returned Books Found!</h3>
            )
     }
  </main>
  {readBookPopup && <ReadBookPopup book={readBook}/>}
  
  </>;
};

export default MyBorrowedBooks;
