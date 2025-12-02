import React from 'react'
import DarkBtn from './light/dark_btn'
import Button1 from './button1'
import Home from "./Pages/Home";
import Login from './Pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
