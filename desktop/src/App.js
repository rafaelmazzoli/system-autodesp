import React from "react";
import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./pages/NavBar";
import Routes from "./Routes.js";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ToastContainer />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
