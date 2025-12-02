import React from "react";
import BGImage from "../Images/Image2.jpg";
import NavBar1 from "../NavBar/NavBar1";

const Home = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed "
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <NavBar1 />

      <div
        className="
  lg:px-40 md:px-10 bg-black/45 h-[100vh] shadow-xl 
  flex flex-col justify-center items-center text-center px-6
"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
          Skill Fusion
        </h1>

        <p className="mt-14 font-bold text-lg md:text-xl max-w-[600px] text-gray-200 leading-relaxed w-[90%] md:w-[70%] lg:w-[60%]">
          Skill Fusion is a modern platform designed to streamline project and
          skill management. Manage team skills, track project requirements, and
          match the right people to the right tasks with precision and ease.
        </p>

        <button
          className="mt-10 px-8 py-3 bg-black/80 hover:bg-black text-white rounded-xl 
    text-base md:text-lg font-semibold shadow-md transition-all duration-300 "
        >
          Explore Platform
        </button>
      </div>

      <div className="lg:mx-10 bg-black bg-opacity-80 py-20 h-[290vh]"></div>
    </div>
  );
};

export default Home;
