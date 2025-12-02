import React, { useEffect, useState } from "react";

const Button1 = () => {
  const [theme, setTheme] = useState("light");

  // Add or remove "dark" class from <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      <div className=" toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Button1;
