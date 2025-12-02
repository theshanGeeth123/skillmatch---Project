import React from "react";
import Logo1 from "../Images/Logo2.png"

const NavBar1 = () => {
  return (
    <nav className=" w-full fixed top-0 left-0 z-50   shadow-sm dark:bg-black/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
       
        <div className="flex items-center gap-2">
          
          <img 
            src={Logo1} 
            alt="Logo" 
            className="w-auto h-10 object-contain"
          />
        </div>

        {/* --- RIGHT SIDE BUTTONS --- */}
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-lg border border-white text-white dark:text-gray-100 dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition hover:text-black">
            Sign In
          </button>

          <button className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-black transition">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar1;
