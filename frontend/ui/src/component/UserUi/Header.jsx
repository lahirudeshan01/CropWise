import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import "../App.css";
import "./all.css"

const Header = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="navbar"
    >
      <div className="logo">
        <img src="/images/logo.png" alt="CropWise Logo" className="logo-image" />
        <span className="logo-text">CropWise</span>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link> {/* Use Link for navigation */}
        </li>
        <li>
          <Link to="/about">About</Link> {/* Use Link for navigation */}
        </li>
        <li>
          <Link to="/buy">Buy</Link> {/* Use Link for navigation */}
        </li>
      </ul>
      <button className="login-btn">Login</button>
    </motion.nav>
  );
};

export default Header;