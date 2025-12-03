import React, { useState } from "react";
import BGImage from "../Images/Image2.jpg";
import NavBar2 from "../NavBar/NavBar2";
import { useSearchParams, useNavigate } from "react-router-dom";
import Footer1 from "../Footers/Footer1";

const API_BASE_URL = "http://localhost:5000/api";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultMode = searchParams.get("mode") || "login";
  const [mode, setMode] = useState(defaultMode);
  const isLogin = mode === "login";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setSearchParams({ mode: newMode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Login failed");
        }

        // 💾 Store userId & name for multi-user support
        localStorage.setItem("sf_userId", data.data.user.id);
        localStorage.setItem("sf_userName", data.data.user.name);

        navigate("/dashboard");
      } else {
        // REGISTER
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Registration failed");
        }

        switchMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <NavBar2 />

      <div className="flex items-center justify-center min-h-screen px-4 py-24 bg-black/60">
        <div className="grid w-full max-w-4xl gap-10 p-8 border shadow-2xl md:grid-cols-2 bg-white/5 border-white/10 rounded-3xl md:p-10 backdrop-blur-md">
          
          {/* Left */}
          <div className="flex flex-col justify-center text-white">
            <h1 className="mb-4 text-3xl font-extrabold tracking-wide md:text-4xl">
              {isLogin ? "Welcome back to" : "Join"}{" "}
              <span className="text-blue-300">Skill Fusion</span>
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
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

          {/* Form */}
          <div className="p-6 text-white border shadow-lg bg-black/60 border-white/10 rounded-2xl md:p-8">
            
            {/* Toggle */}
            <div className="flex p-1 mb-6 rounded-xl bg-white/5">
              <button
                onClick={() => switchMode("login")}
                className={`w-1/2 py-2 rounded-lg font-semibold transition-all ${
                  isLogin ? "bg-white text-black shadow-md" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => switchMode("register")}
                className={`w-1/2 py-2 rounded-lg font-semibold transition-all ${
                  !isLogin ? "bg-white text-black shadow-md" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Register
              </button>
            </div>

            <h2 className="mb-4 text-xl font-bold md:text-2xl">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>

            {error && (
              <div className="px-3 py-2 mb-3 text-sm text-red-300 border rounded-md bg-red-900/40 border-red-500/40">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-1 text-sm">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white/10 border-white/20"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white/10 border-white/20"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white/10 border-white/20"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-1 text-sm">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white/10 border-white/20"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-500/90 hover:bg-blue-500 text-white font-semibold disabled:opacity-60"
              >
                {loading ? (isLogin ? "Logging in..." : "Creating account...") : isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-gray-300">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => switchMode("register")} className="text-blue-300 hover:underline">
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => switchMode("login")} className="text-blue-300 hover:underline">
                    Login here
                  </button>
                </>
              )}
            </p>
          </div>

        </div>
      </div>

      <Footer1 />
    </div>
  );
};

export default Login;
