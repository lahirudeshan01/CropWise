import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "./Header";
import Footer from "./Footer";
// import "../App.css";
import "./all.css"

function AboutUs() {
  const { pathname } = useLocation(); // Get the current pathname

  // Scroll to the top whenever the pathname changes (including on refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Add pathname as a dependency

  return (
    <div className="about-us-container">
      <Header />

      <div className="about-us-content">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="about-us-heading-box"
        >
          <h1 className="about-us-heading">Aboutp</h1>
        </motion.div>

        <motion.section
          className="mission-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <img 
            src="https://www.onlanka.com/wp-content/uploads/2021/11/paddy-farmers-fertilizer.jpg" 
            alt="Agriculture Technology" 
            className="mission-image"
          />
          <p className="mission-text">
            At CropWise, we are committed to transforming the agricultural industry through innovation and technology. Our mission is to empower farmers and agribusinesses with cutting-edge tools that enhance productivity, efficiency, and sustainability. By leveraging smart data analytics, AI-driven insights, and precision farming techniques, we enable better decision-making, optimized resource management, and increased crop yields. We understand the challenges faced by modern agriculture, from unpredictable weather patterns to the rising demand for food production. That’s why we strive to bridge the gap between traditional farming methods and advanced digital solutions. Whether it’s through real-time monitoring, automated farm management systems, or intelligent irrigation techniques, we help farmers stay ahead in an ever-evolving industry. At the heart of our vision is a future where technology and nature work in harmony to create a more resilient and productive agricultural ecosystem. Join us in revolutionizing the way we grow, manage, and sustain our food sources for generations to come.
          </p>
        </motion.section>

        <motion.section
          className="vision-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <p className="vision-text">
          In addition to empowering farmers with smart agricultural solutions, CropWise is dedicated to fostering a sustainable future through eco-friendly practices and responsible resource management. We believe that innovation should go hand in hand with environmental stewardship, ensuring that farming remains both profitable and sustainable. Our advanced solutions not only help reduce water and fertilizer waste but also promote soil health and biodiversity. By integrating automation, IoT-based monitoring, and predictive analytics, we enable farmers to make informed decisions that minimize environmental impact while maximizing yields. As we continue to push the boundaries of agricultural technology, our goal is to create a more resilient food system—one that supports farmers, protects natural resources, and secures food production for future generations.
          </p>
          <img 
            src="https://www.villagesquare.in/wp-content/uploads/2021/02/02-1-1024x550.jpg" 
            alt="Agriculture Technology" 
            className="vision-image"
          />
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}

export default AboutUs;