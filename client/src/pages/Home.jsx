import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate, Outlet} from "react-router-dom";
import SideBar from "../layout/SideBar.jsx";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  //  if (loading) return null;
 


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
   

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="md:hidden z-10 absolute right-6 top-4 bg-black rounded-md h-9 w-9 text-white flex items-center justify-center">
        <GiHamburgerMenu
          className="text-2xl cursor-pointer"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>

      {/* Sidebar */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />

      {/* 🔥 ROUTED CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
