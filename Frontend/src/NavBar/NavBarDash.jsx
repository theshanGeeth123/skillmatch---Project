import React from "react";
import Logo1 from "../Images/Logo2.png"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NavBarDash = () => {
  
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("sf_userId");
    localStorage.removeItem("sf_userName");
    navigate("/login");
  };
  
  
  return (
    <nav className="fixed top-0 left-0 z-50 w-full shadow-sm ">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
       
        <div className="flex items-center gap-2">
          
          <img 
            src={Logo1} 
            alt="Logo" 
            className="object-contain w-auto h-10"
          />
        </div>

        <div className="flex items-center gap-4">

          
            <button onClick={handleLogout} className="px-5 py-2 text-white transition border border-white rounded-lg hover:bg-red-600 hover:text-white hover:border-none">
              Sign Out
            </button>
          

          

        </div>

      </div>
    </nav>
  );
};

export default NavBarDash;
