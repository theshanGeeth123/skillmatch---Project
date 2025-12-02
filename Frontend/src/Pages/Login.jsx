import React, { useState } from "react";
import BGImage from "../Images/Image2.jpg";
import NavBar2 from "../NavBar/NavBar2";
import { useSearchParams } from "react-router-dom";
import Footer1 from "../Footers/Footer1";


const Login = () => {
  const [searchParams] = useSearchParams();
const defaultMode = searchParams.get("mode") || "login"; 
const [mode, setMode] = useState(defaultMode);


  const isLogin = mode === "login";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login submit");
    } else {
     
      console.log("Register submit");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed "
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <NavBar2 />

      <div className="min-h-screen bg-black/60 flex items-center justify-center px-4 py-24 ">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md">
          {/* Left side text */}
          <div className="flex flex-col justify-center text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-4">
              {isLogin ? "Welcome back to" : "Join"}{" "}
              <span className="text-blue-300">Skill Fusion</span>
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
              {isLogin
                ? "Sign in to manage projects, assign the right people, and keep track of skills effortlessly."
                : "Create your account to start managing skills, projects, and teams in one powerful platform."}
            </p>

            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Centralized skill & project management</li>
              <li>• Smart matching for team assignments</li>
              <li>• Charts & analytics for better decisions</li>
            </ul>
          </div>

          {/* Right side form */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8 text-white shadow-lg">
            {/* Toggle buttons */}
            <div className="flex mb-6 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setMode("login")}
                className={`w-1/2 py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-black shadow-md"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`w-1/2 py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-black shadow-md"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Register
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name - only for register */}
              {!isLogin && (
                <div>
                  <label className="block text-sm mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Confirm password - only for register */}
              {!isLogin && (
                <div>
                  <label className="block text-sm mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              )}

              {/* Remember / forgot - only for login */}
              {isLogin && (
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-300 ">
                  
                  <button
                    type="button"
                    className="hover:text-blue-300 underline underline-offset-2"
                  >
                    {/* Forgot password? */}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-2.5 md:py-3 rounded-xl bg-blue-500/90 hover:bg-blue-500 text-white text-sm md:text-base font-semibold shadow-lg transition-all"
              >
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-xs md:text-sm text-gray-300 text-center">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-blue-300 hover:underline"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-300 hover:underline"
                  >
                    Login here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

    <Footer1/>

    </div>
  );
};

export default Login;
