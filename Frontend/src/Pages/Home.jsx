import React, { useEffect, useState } from "react";
import BGImage from "../Images/Image2.jpg";
import NavBar1 from "../NavBar/NavBar1";

import PImage1 from "../Images/person1.avif";
import PImage2 from "../Images/person2.jpg";
import PImage3 from "../Images/person3.jpg";

import "@fortawesome/fontawesome-free/css/all.min.css";

import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className="w-full min-h-screen bg-fixed bg-center bg-cover "
        style={{ backgroundImage: `url(${BGImage})` }}
      >
        <NavBar1 />

        <div
          className="
          lg:px-40 md:px-10 bg-black/45 h-[100vh] 
          flex flex-col justify-center items-center text-center px-6  "
        >
          <h1
            className="text-4xl font-extrabold tracking-wide text-white md:text-5xl"
            data-aos="fade-up"
          >
            Skill Fusion
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-14 font-medium lg:text-[20px] md:text-[15px] max-w-[600px] text-gray-200 leading-relaxed w-[90%] md:w-[70%] lg:w-[60%]"
          >
            Skill Fusion is a modern platform designed to streamline project and
            skill management. Manage team skills, track project requirements,
            and match the right people to the right tasks with precision and
            ease.
          </p>

          <button
            data-aos="fade-up"
            data-aos-delay="400"
            onClick={() => {
              document.getElementById("section2")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="px-8 py-3 mt-10 text-base font-semibold text-white transition-all duration-300 shadow-md bg-black/80 hover:bg-black rounded-xl md:text-lg "
          >
            Explore Platform
          </button>
        </div>

        <div id="section2" className="py-20 bg-black/45 ">
          <div className="px-6 mx-auto text-white max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-wide md:text-4xl">
                Our Services
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-sm text-gray-300 md:text-base">
                Skill Fusion provides an integrated platform to manage
                personnel, skills, and project requirements with precision and
                clarity.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div
                data-aos="flip-up"
                data-aos-delay="100"
                className="bg-white/10 backdrop-blur-md border border-white/20 
                    rounded-2xl p-6 shadow-lg 
                    transition-all duration-500
                    hover:-translate-y-3 hover:scale-[1.03]
                    hover:shadow-2xl hover:bg-white/20
                    hover:border-white/40 cursor-pointer
                      "
              >
                <h3 className="mb-3 text-xl font-semibold">
                  Personnel Management
                </h3>
                <p className="text-sm text-gray-300">
                  Maintain detailed personnel profiles to organize teams and
                  track availability for projects.
                </p>
              </div>

              <div
                data-aos="flip-up"
                data-aos-delay="500"
                className="bg-white/10 backdrop-blur-md border border-white/20 
                rounded-2xl p-6 shadow-lg 
                transition-all duration-500
                hover:-translate-y-3 hover:scale-[1.03]
                hover:shadow-2xl hover:bg-white/20
                hover:border-white/40 cursor-pointer"
              >
                <h3 className="mb-3 text-xl font-semibold">
                  Find Relevant Team Members
                </h3>
                <p className="text-sm text-gray-300">
                  Automatically match the best-suited team members to specific
                  projects based on skill alignment.
                </p>
              </div>

              <div
                data-aos="flip-up"
                data-aos-delay="900"
                className="bg-white/10 backdrop-blur-md border border-white/20 
                rounded-2xl p-6 shadow-lg 
                transition-all duration-500
                hover:-translate-y-3 hover:scale-[1.03]
                hover:shadow-2xl hover:bg-white/20
                hover:border-white/40 cursor-pointer"
              >
                <h3 className="mb-3 text-xl font-semibold">
                  Manage Member Skills
                </h3>
                <p className="text-sm text-gray-300">
                  Keep track of employee skills and experience levels to
                  maintain a powerful skills database.
                </p>
              </div>

              <div
                data-aos="flip-up"
                data-aos-delay="1300"
                className="bg-white/10 backdrop-blur-md border border-white/20 
                rounded-2xl p-6 shadow-lg 
                transition-all duration-500
                hover:-translate-y-3 hover:scale-[1.03]
                hover:shadow-2xl hover:bg-white/20
                hover:border-white/40 cursor-pointer"
              >
                <h3 className="mb-3 text-xl font-semibold">
                  Charts & Analytics
                </h3>
                <p className="text-sm text-gray-300">
                  Gain insights using visual analytics to identify skill gaps
                  and team strengths instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 bg-black/45">
          <div className="max-w-6xl px-6 mx-auto text-white">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-wide md:text-4xl">
                What Our Users Say
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-sm text-gray-300 md:text-base">
                Teams use Skill Fusion to streamline projects, understand
                skills, and build high-performing teams with confidence.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative p-8 border shadow-lg bg-white/5 border-white/10 rounded-2xl pt-14 backdrop-blur-md">
                <div className="absolute w-16 h-16 overflow-hidden -translate-x-1/2 border-4 rounded-full -top-10 left-1/2 border-black/60">
                  <img
                    src={PImage1}
                    alt="User 1"
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                  “Skill Fusion helps us quickly see who is available and which
                  skills we have in the team. Assigning people to projects is
                  now effortless.”
                </p>

                <div className="text-center">
                  <div className="mb-1 text-sm text-gray-400">
                    NovaTech Solutions
                  </div>
                  <div className="text-sm font-semibold md:text-base">
                    Sarah Collins, Project Lead
                  </div>
                </div>
              </div>

              <div className="relative p-8 border shadow-lg bg-white/5 border-white/10 rounded-2xl pt-14 backdrop-blur-md">
                <div className="absolute w-16 h-16 overflow-hidden -translate-x-1/2 border-4 rounded-full -top-10 left-1/2 border-black/60">
                  <img
                    src={PImage2}
                    alt="User 2"
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                  “The skill tracking and matching features save us hours every
                  week. We finally have a clear view of our capabilities across
                  projects.”
                </p>

                <div className="text-center">
                  <div className="mb-1 text-sm text-gray-400">
                    BrightLane Consulting
                  </div>
                  <div className="text-sm font-semibold md:text-base">
                    Daniel Lee, Operations Manager
                  </div>
                </div>
              </div>

              <div className="relative p-8 border shadow-lg bg-white/5 border-white/10 rounded-2xl pt-14 backdrop-blur-md">
                <div className="absolute w-16 h-16 overflow-hidden -translate-x-1/2 border-4 rounded-full -top-10 left-1/2 border-black/60">
                  <img
                    src={PImage3}
                    alt="User 3"
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                  “The charts and analytics give us instant insight into skill
                  gaps and future hiring needs. Skill Fusion has become a key
                  planning tool.”
                </p>

                <div className="text-center">
                  <div className="mb-1 text-sm text-gray-400">
                    EdgePoint Digital
                  </div>
                  <div className="text-sm font-semibold md:text-base">
                    Maria Gomez, HR & Talent Partner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="lx-footer relative bg-gray-950/90 px-4 py-8 text-center text-[#f4f4f4] border-t-1  shadow-lg b">
          <div className="lx-footer__subscribe">
            <h3 className="mb-4 font-medium">
              Stay up to date on the latest from SkillFusion
            </h3>
          </div>

          <div className="mt-8 lx-footer__social">
            <h4 className="mb-4 font-semibold">Follow SkillFusion </h4>
            <div className="flex justify-center gap-2 lx-footer__icons">
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

          <div className="lx-footer__meta mt-8 text-[#b3b3b3]">
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

        {/* Back to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed z-50 flex items-center justify-center w-12 h-12 text-white transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 bg-black/80 hover:bg-black hover:scale-110"
            aria-label="Back to top"
          >
            <i className="text-lg fas fa-arrow-up" />
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
