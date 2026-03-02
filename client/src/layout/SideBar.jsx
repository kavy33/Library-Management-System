import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import { BarChart3 } from "lucide-react";
import { History } from "lucide-react"; // 👈 Add this
const SideBar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector(
    (state) => state.popup,
  );
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside
        className={`${isSideBarOpen ? "left-0" : "-left-full"} z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8 ">
          <img src={logo_with_title} alt="logo" className="" />
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {/* DASHBOARD: Only show if logged in */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            >
              <img src={dashboardIcon} alt="icon" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* BOOKS: Visible to everyone */}
          <Link
            to="/books"
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </Link>

          {/* ADMIN LINKS: Only show if Admin */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <Link
                to="/catalog"
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </Link>

              <Link
                to="/users"
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </Link>

                          <Link
                           to="/admin/reports"
                          className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                          >
                              <img src={dashboardIcon} alt="icon" />
                            <span>Reports</span>
                         </Link> 
                             <Link to="/admin/payment-history"
                               className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                              >
                                
                                 <History className="w-5 h-5 shrink-0" />
                                 <span>Payment History</span>
                                  </Link>

                         <Link
                          to="/admin/analytics"
                          className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                        >
                 <BarChart3 size={18} />
                <span>Payment Analytics</span>
               </Link>

           

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {/* USER LINKS: Only show if User */}
          {isAuthenticated && user?.role === "User" && (
            <>
            <Link
              to="/my-borrowed-books"
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            >
              <img src={catalogIcon} alt="icon" />
              <span>My Borrowed Books</span>
            </Link>

             <Link
  to="/wallet"
  className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
>
  <Wallet size={20} />
  <span>My Wallet</span>
</Link>
</>

            
          )}

          {/* SETTINGS: Only show if logged in */}
          {isAuthenticated && (
            <button
              className="md:hidden w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              onClick={() => dispatch(toggleSettingPopup())}
            >
              <img src={settingIcon} alt="icon" />
              <span>Update Credentials</span>
            </button>
          )}
        </nav>

        {/* LOGOUT BUTTON: Only show if logged in */}
        {isAuthenticated && (
          <div className="px-6 py-4">
            <button
              className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="icon" />
              <span>LogOut</span>
            </button>
          </div>
        )}

        {/* LOGIN BUTTON: Only show if NOT logged in */}
        {!isAuthenticated && (
          <div className="px-6 py-4">
            <button
              className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit"
              onClick={() => navigate("/login")}
            >
              <img src={logoutIcon} alt="icon" />
              <span>LogIn</span>
            </button>
          </div>
        )}

        {/* Mobile Close Icon */}
        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer"
        />
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;