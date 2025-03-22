import React from "react";
import { motion } from "framer-motion";
// import "../App.css";
import "./all.css"

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-content">
        <div className="footer-left">
        <h3>Contact Us</h3> 
          <p><i className="fas fa-phone"></i> +94 71 455 5563</p>
          <p><i className="fas fa-map-marker-alt"></i> 87 Main Street Colombo 7</p>
          <p><i className="fas fa-envelope"></i> Support@info.lk</p>
        </div>
        <div className="footer-center">
          <h3>About the Company</h3>
          <p>
          CropWise empowers farmers with innovative technology to optimize productivity and sustainability. We provide data-driven solutions and expert guidance to help farmers achieve better yields and smarter farming practices.
          </p>
        </div>
        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-media">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>
      <p className="copyright">© 2025 CropWise. All rights reserved.</p>
    </motion.footer>
  );
};

export default Footer;
