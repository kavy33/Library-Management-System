import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OTP from "./pages/OTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import UserDashboard from "./components/UserDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import BookManagement from "./components/BookManagement.jsx";
import Catalog from "./components/Catalog.jsx";
import Users from "./components/Users.jsx";
import MyBorrowedBooks from "./components/MyBorrowedBooks.jsx";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice.js";
import { fetchAllBooks } from "./store/slices/bookSlice.js";
import { fetchAllUsers } from "./store/slices/userSlice.js";
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice.js";
import Deposit from "./pages/Deposit.jsx";


const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
  if (!user) return;

  // ✅ COMMON DATA
  dispatch(fetchAllBooks());

  // ✅ USER ROLE
  if (user.role === "User") {
    dispatch(fetchUserBorrowedBooks());
  }

  // ✅ ADMIN ROLE
  if (user.role === "Admin") {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBorrowedBooks());
  }

}, [dispatch, user]);

  return (
    <Router>
      <Routes>

        {/* Redirect root */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

        {/* Layout */}
        <Route element={<Home />}>

         <Route
            index
            element={
              user?.role === "Admin"
              ? <AdminDashboard />
              : <UserDashboard />
          }
            />

          <Route
            path="dashboard"
            element={
              user?.role === "Admin"
                ? <AdminDashboard />
                : <UserDashboard />
            }
          />

          <Route path="books" element={<BookManagement />} />
           <Route path="deposit" element={<Deposit />} /> 
          <Route path="catalog" element={<Catalog />} />
          <Route path="users" element={<Users />} />
          <Route path="my-borrowed-books" element={<MyBorrowedBooks />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

      </Routes>

      <ToastContainer theme="dark" />
    </Router>
  );
};

export default App;
