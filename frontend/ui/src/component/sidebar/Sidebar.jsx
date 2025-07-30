import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { SidebarDate } from "./SidebarDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import OrderNotifications from '../ordernotification/OrderNotifications';
import "./sidebar.css";
import icon from "../../assets/icon.png"

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("cropwise-sidebar");
      const toggleButton = document.getElementById("sidebar-toggle-button");

      if (
        isMobile &&
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const subMenuVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1,
      height: "auto",
      marginTop: 5,
      marginBottom: 5,
      transition: { duration: 0.3, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.05 }
    },
    exit: { 
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const logoVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 5, scale: 1.1, transition: { duration: 0.3 } }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        id="sidebar-toggle-button"
        className="sidebar-toggle-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        initial={false}
        animate={{ left: isMobile ? (sidebarOpen ? "270px" : "10px") : "270px", backgroundColor: "#16A21A" }}
        transition={{ duration: 0.3 }}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        id="cropwise-sidebar" 
        className="sidebar"
        initial={false}
        animate={{ x: isMobile && !sidebarOpen ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Logo Section */}
        <div className="sidebar-header">
          <Link to="/home" className="logo-link">
            <motion.img
              src={icon}//new link 1
              alt="CropWise Logo"
              className="sidebar-logo"
              variants={logoVariants}
              initial="rest"
              whileHover="hover"
            />
            <motion.div 
              className="logo-text-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="sidebar-title">CropWise</h2>
              <span className="sidebar-subtitle">Smart Agriculture</span>
            </motion.div>
          </Link>
          <div className="notification-container">
            <OrderNotifications />
          </div>
        </div>

        <div className="divider"></div>

        {/* Sidebar Menu */}
        <ul className="sidebar-menu">
          {SidebarDate.map((val, key) => (
            <React.Fragment key={key}>
              <motion.li
                custom={key}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  if (val.subMenu) {
                    toggleDropdown(key);
                  } else {
                    navigate(val.link);
                    if (isMobile) setSidebarOpen(false);
                  }
                }}
                className={`sidebar-item ${location.pathname === val.link ? "active" : ""}`}
                whileHover={{ 
                  backgroundColor: location.pathname === val.link ? "#16a21a" : "rgba(255, 255, 255, 0.1)",
                  x: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`active-indicator ${location.pathname === val.link ? "visible" : ""}`} />
                <div className="icon-container">
                  <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                    {val.icon}
                  </motion.div>
                </div>
                <div className="item-title">{val.title}</div>
                {val.subMenu && (
                  <motion.div 
                    className="dropdown-indicator"
                    animate={{ rotate: openDropdown === key ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExpandMoreIcon />
                  </motion.div>
                )}
              </motion.li>

              {/* SubMenu */}
              <AnimatePresence>
                {val.subMenu && openDropdown === key && (
                  <motion.ul 
                    variants={subMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {val.subMenu.map((subItem, subKey) => (
                      <motion.li
                        key={subKey}
                        variants={itemVariants}
                        onClick={() => {
                          if (subItem.externalLink) {
                            window.open(subItem.externalLink, "_blank");
                          } else if (subItem.link) {
                            navigate(subItem.link);
                            if (isMobile) setSidebarOpen(false);
                          }
                        }}
                        className={`sidebar-item sub-item ${
                          location.pathname === subItem.link ? "active" : ""
                        }`}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      >
                        <div className={`active-indicator ${location.pathname === subItem.link ? "visible" : ""}`} />
                        <div className="icon-container">{subItem.icon}</div>
                        <div className="item-title">{subItem.title}</div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>© 2025 CropWise</p>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
