import React from "react";
import Logo1 from "../Images/Logo2.png"
import { Link } from "react-router-dom";

const NavBar1 = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full shadow-sm dark:bg-black/40">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
       
        <div className="flex items-center gap-2">
          
          <img 
            src={Logo1} 
            alt="Logo" 
            className="object-contain w-auto h-10"
          />
        </div>


          <Link to="/dashboard">
            <button className="px-5 py-2 text-white transition border border-white rounded-lg hover:bg-gray-100 hover:text-black">
              Dashboard
            </button>
          </Link>
      </div>
    </nav>
  );
};

export default NavBar1;
