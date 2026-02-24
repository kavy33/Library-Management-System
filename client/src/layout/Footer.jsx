import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";


const Footer = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { allBooks } = useSelector((state) => state.book);
const { allUsers } = useSelector((state) => state.user);
const { allBorrowedBooks } = useSelector((state) => state.borrow);

const totalBooks = allBooks?.length || 0;
const totalUsers = allUsers?.length || 0;
const totalBorrowed = allBorrowedBooks?.length || 0;

const totalReturned =
  allBorrowedBooks?.filter((book) => book.status === "Returned").length || 0;

  return (
    <footer className="bg-black text-gray-300 w-full mt-16 md:pl-64">
   <div className="px-16 py-12 
                  grid grid-cols-1 md:grid-cols-3 
                  gap-12">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            BookWorm Library
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            A modern digital library system built with MERN stack.
            Manage, borrow and explore books with ease.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">

            {isAuthenticated && (
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link to="/books" className="hover:text-white">
                Books
              </Link>
            </li>

            {!isAuthenticated && (
                 <li>
                    <Link to="/login" className="hover:text-white">
                     Login
                     </Link>
                 </li>
             )}

            {/* USER */}
            {isAuthenticated && user?.role === "User" && (
              <li>
                <Link to="/my-borrowed-books" className="hover:text-white">
                  My Borrowed Books
                </Link>
              </li>
            )}

            {/* ADMIN */}
            {isAuthenticated && user?.role === "Admin" && (
              <>
                <li>
                  <Link to="/catalog" className="hover:text-white">
                    Catalog
                  </Link>
                </li>

                <li>
                  <Link to="/users" className="hover:text-white">
                    Users
                  </Link>
                </li>

                <li>
                  <Link to="/admin/reports" className="hover:text-white">
                    Reports
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <Mail size={16} />
              <a
                href="mailto:kavypatel19112005@gmail.com"
                className="hover:text-white"
              >
                kavypatel19112005@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} />
              <a
                href="tel:+918866050601"
                className="hover:text-white"
              >
                +91 88660 00601
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} />
              <span>Ahmedabad, Gujarat</span>
            </div>
          </div>
        </div>

  

      </div>



      {/* BOTTOM */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} BookWorm Library. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;