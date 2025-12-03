import React from 'react'
import DarkBtn from './light/dark_btn'
import Button1 from './button1'
import Home from "./Pages/Home";
import Login from './Pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard.jsx";
import Personnel from "./Pages/Personnel.jsx";
import Skills from "./Pages/Skills.jsx";
import PersonnelSkills from "./Pages/PersonnelSkills.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personnel" element={<Personnel />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/personnel-skills" element={<PersonnelSkills />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
