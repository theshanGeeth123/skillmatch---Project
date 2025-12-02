import React, { useEffect, useState } from "react";

const DarkBtn = () => {
  const [theme, setTheme] = useState("light");

  // Apply or remove "dark" class from <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        px-4 py-2 rounded-lg shadow-md transition-colors
        bg-slate-200 text-slate-900
        dark:bg-slate-800 dark:text-slate-100
        border border-slate-400 dark:border-slate-600
         fixed top-4 right-4 
      "
    >
      {theme === "dark" ? " ☀️" : "🌙"}
    </button>
  );
};

export default DarkBtn;
