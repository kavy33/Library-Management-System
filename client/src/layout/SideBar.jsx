import React from "react";
import { Link } from "react-router-dom";

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
import { useEffect } from "react";
import { toast } from "react-toastify"
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { BookIcon } from "lucide-react";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import { LineElement } from "chart.js";


const SideBar = ({ isSideBarOpen, setIsSideBarOpen}) => {
  const dispatch = useDispatch();
  const {addNewAdminPopup, settingPopup} = useSelector(state=> state.popup);
  const { loading, error, message, user, isAuthenticated} = useSelector((state) => state.auth); 
  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if(message){
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  },[dispatch, isAuthenticated , error, loading, message]);
 
  return (
    <>
    <aside className={`${isSideBarOpen ? "left-0" : "-left-full"} z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`} 
    style={{position:"fixed"}}>
        <div className="px-6 py-4 my-8 ">
          <img src={logo_with_title} alt="logo" className=""/>

        </div>
        <nav className="flex-1 px-6 space-y-2">
          <Link to="/dashboard"
                    className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2">
          
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
            </Link>
        
          <Link to="/books"
           className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2">
          
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
            </Link>
         
          { isAuthenticated && user?.role === "Admin" && (
          <> 
               <Link to="/catalog"
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2">
          
            <img src={catalogIcon} alt="icon" />
            <span>Catalog</span>
          </Link>

           <Link to="/users"
               className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2">
           
            <img src={usersIcon} alt="icon" />
            <span>Users</span>
            </Link>
          
           <button 
           className="w-full py-2 font-medium
             bg-transparent rounded-md 
             hover:cursor-pointer flex items-center 
             space-x-2"
            onClick = {() => dispatch(toggleAddNewAdminPopup())}
            >

         
           
           
            <RiAdminFill className="w-6 h-6"/>
            <span>Add New Admin</span>
              </button>
            
        
              
              </> 
             )}
             {isAuthenticated && user?.role === "User" && (
              <>
               <Link to="/my-borrowed-books" 
               className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2">
          
            <img src={catalogIcon} alt="icon" />
            <span>My Borrowed Books</span>
         </Link>

              </>

             )}
              <button className="md:hidden w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
           onClick={()=>dispatch(toggleSettingPopup())}
           >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        
        </nav>
        <div className="px-6 py-4">
          <button className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex
        item-center justify-center space-x-5 mx-auto w-fit" onClick={handleLogout}> <img src={logoutIcon} alt="icon" />
         <span> LogOut  </span>
        </button>

        </div>
        <img src={closeIcon} alt="icon" onClick={()=> setIsSideBarOpen(!isSideBarOpen)} className="h-fit w-fit absolute top-0 right-4 mt-4 blcok md:hidden " />
        
    </aside>
    {addNewAdminPopup && <AddNewAdmin/>}
    { settingPopup && <SettingPopup/>}
      
    </>
  );
};

export default SideBar;
