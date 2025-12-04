import React, { useState } from "react";
import Logo1 from "../Images/Logo2.png";
import { useNavigate } from "react-router-dom";

const NavBarDash = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("sf_userId");
    localStorage.removeItem("sf_userName");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-50 w-full shadow-sm bg-black/30 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={Logo1}
              alt="Logo"
              className="object-contain w-auto h-10"
            />
          </div>

          {/* Sign out button */}
          <div>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-5 py-2 text-white transition border border-white rounded-lg hover:bg-red-600 hover:border-red-600"
            >
              Sign Out
            </button>
          </div>

        </div>
      </nav>

      {/* CONFIRMATION POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure you want to sign out?
            </h2>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 text-gray-700 transition border border-gray-400 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBarDash;
