import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../layout/SideBar.jsx";
import Footer from "../layout/Footer";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Optional Auth Protection
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 relative md:pl-64">

        {/* Mobile Menu Button */}
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

        {/* Routed Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>

      {/* FOOTER - Outside Main Row */}
      <Footer />

    </div>
  );
};

export default Home;