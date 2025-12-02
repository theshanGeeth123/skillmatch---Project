import React from "react";
import BGImage from "../Images/Image2.jpg";
import NavBar1 from "../NavBar/NavBar1";

import PImage1 from "../Images/person1.avif";
import PImage2 from "../Images/person2.jpg";
import PImage3 from "../Images/person3.jpg";

import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed "
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <NavBar1 />

      <div
        className="
          lg:px-40 md:px-10 bg-black/45 h-[100vh] 
          flex flex-col justify-center items-center text-center px-6  "
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
          Skill Fusion
        </h1>

        <p className="mt-14 font-medium lg:text-[20px] md:text-[15px] max-w-[600px] text-gray-200 leading-relaxed w-[90%] md:w-[70%] lg:w-[60%]">
          Skill Fusion is a modern platform designed to streamline project and
          skill management. Manage team skills, track project requirements, and
          match the right people to the right tasks with precision and ease.
        </p>

        <button
          onClick={() => {
            document.getElementById("section2")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="mt-10 px-8 py-3 bg-black/80 hover:bg-black text-white rounded-xl 
    text-base md:text-lg font-semibold shadow-md transition-all duration-300 "
        >
          Explore Platform
        </button>
      </div>

      <div id="section2" className="bg-black/45 py-20 ">
        <div className="max-w-7xl mx-auto px-6 text-white">
     
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              Our Services
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
              Skill Fusion provides an integrated platform to manage personnel,
              skills, and project requirements with precision and clarity.
            </p>
          </div>

       
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 
                      rounded-2xl p-6 shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">
                Personnel Management
              </h3>
              <p className="text-gray-300 text-sm">
                Maintain detailed personnel profiles to organize teams and track
                availability for projects.
              </p>
            </div>

         
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 
                      rounded-2xl p-6 shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">
                Find Relevant Team Members
              </h3>
              <p className="text-gray-300 text-sm">
                Automatically match the best-suited team members to specific
                projects based on skill alignment.
              </p>
            </div>

       
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 
                      rounded-2xl p-6 shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">
                Manage Member Skills
              </h3>
              <p className="text-gray-300 text-sm">
                Keep track of employee skills and experience levels to maintain
                a powerful skills database.
              </p>
            </div>

       
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 
                      rounded-2xl p-6 shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">Charts & Analytics</h3>
              <p className="text-gray-300 text-sm">
                Gain insights using visual analytics to identify skill gaps and
                team strengths instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/45 py-20">
        <div className="max-w-6xl mx-auto px-6 text-white">
     
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              What Our Users Say
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
              Teams use Skill Fusion to streamline projects, understand skills,
              and build high-performing teams with confidence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
         
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 pt-14 shadow-lg backdrop-blur-md">
           
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-black/60">
              
                <img
                  src={PImage1}
                  alt="User 1"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
                “Skill Fusion helps us quickly see who is available and which
                skills we have in the team. Assigning people to projects is now
                effortless.”
              </p>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">
                  NovaTech Solutions
                </div>
                <div className="font-semibold text-sm md:text-base">
                  Sarah Collins, Project Lead
                </div>
              </div>
            </div>

            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 pt-14 shadow-lg backdrop-blur-md">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-black/60">
                <img
                  src={PImage2}
                  alt="User 2"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
                “The skill tracking and matching features save us hours every
                week. We finally have a clear view of our capabilities across
                projects.”
              </p>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">
                  BrightLane Consulting
                </div>
                <div className="font-semibold text-sm md:text-base">
                  Daniel Lee, Operations Manager
                </div>
              </div>
            </div>

            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 pt-14 shadow-lg backdrop-blur-md">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-black/60">
                <img
                  src={PImage3}
                  alt="User 3"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
                “The charts and analytics give us instant insight into skill
                gaps and future hiring needs. Skill Fusion has become a key
                planning tool.”
              </p>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">
                  EdgePoint Digital
                </div>
                <div className="font-semibold text-sm md:text-base">
                  Maria Gomez, HR & Talent Partner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="lx-footer relative bg-gray-950 px-4 py-8 text-center text-[#f4f4f4] border-t-1  shadow-lg b">
  
        <div className="lx-footer__subscribe" data-aos="fade-up">
          <h3 className="mb-4 font-medium">
            Stay up to date on the latest from SkillFusion
          </h3>
        </div>

        <div className="lx-footer__social mt-8" data-aos="fade-up">
          <h4 className="mb-4 font-semibold">Follow SkillFusion </h4>
          <div className="lx-footer__icons flex justify-center gap-2">
            {[
              { icon: "fab fa-facebook-f", url: "#" },
              { icon: "fab fa-linkedin-in", url: "#" },
              { icon: "fab fa-instagram", url: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-black text-[1.2rem] transition-transform duration-300 hover:scale-110"
              >
                <i className={item.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="lx-footer__meta mt-8 text-[#b3b3b3]" data-aos="fade-up">
          <p>
            <br />
          </p>
          <p className="text-[0.9rem]">
            Copyright © {new Date().getFullYear()} All rights reserved | Made{" "}
            <span className="text-red-600"></span> by{" "}
            <a href="#" className="text-[#00aaff]">
              SkillFusion
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
