import React, { useEffect } from "react"; // Import useEffect
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// import "../App.css";
import "./all.css"
const HomePage = () => {
  const navigate = useNavigate();

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Header />
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hero-heading-container"
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
          <h1 className="hero-heading">
            <div>
              {["Empowering Farmers With"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="animated-word"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
            <div>
              {["Cutting-Edge Technology"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="animated-word"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
          </h1>
        </motion.div>
        <p>CropWise offers innovative solutions to help farmers optimize productivity and sustainability.</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="buttons"
        >
          {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="btn buy-btn">
            Buy harvest
          </motion.button> */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="btn buy-btn" onClick={() => navigate("/buy")}>
            Buy Harvest
          </motion.button>
          {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="btn register-btn">
            Register
          </motion.button> */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="btn register-btn" onClick={() => navigate("/register")}>
            Register
          </motion.button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="happy-customers"
        >
          99+ Our Happy Customers
        </motion.p>
      </motion.div>
      {/* Image and Content Section */}
      <div className="image-and-content">
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="image-section">
          <img src="/images/image1.jpg" alt="CropWise" className="hero-image" />
          <h2>All in one solution <br /> for rice cultivation <br /> management</h2>
        </motion.div>
        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="content-section">
          <p>
            This is a comprehensive web application designed to help medium and large-scale farmers efficiently manage their rice farming operations.
            It integrates various modules to streamline farming activities, reduce costs, and increase yield.
          </p>
          <ul className="features">
            <li>Real-time AI support.</li>
            <li>Access valuable expert guidance.</li>
            <li>Enhance data-driven farming.</li>
          </ul>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="more-about-btn" onClick={() => navigate("/about")}>
            MORE ABOUT US.
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;