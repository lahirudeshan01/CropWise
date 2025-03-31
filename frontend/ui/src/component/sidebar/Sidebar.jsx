import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarDate } from "./SidebarDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add event listener to close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("cropwise-sidebar");
      const toggleButton = document.getElementById("sidebar-toggle-button");
      
      if (isMobile && sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          toggleButton && 
          !toggleButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Define styles as individual objects
  const styles = {
    sidebar: {
      width: '260px',
      backgroundColor: '#2c332d',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      overflowY: 'auto',
      transition: 'transform 0.3s ease',
      transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      zIndex: 10,
      boxShadow: isMobile && sidebarOpen ? '2px 0 5px rgba(0,0,0,0.3)' : 'none'
    },
    sidebarHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#2c332d',
      borderBottom: '1px solid #2c332d'
    },
    sidebarLogo: {
      width: '40px',
      height: '40px',
      objectFit: 'contain',
      marginRight: '10px',
      borderRadius: '4px'
    },
    sidebarTitle: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#16a21a'
    },
    ul: {
      listStyleType: 'none',
      padding: 0,
      margin: 0
    },
    sidebarItem: {
      padding: '18px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      marginTop: '5px',
      color: '#fffefe',
      transition: 'background-color 0.2s',
      position: 'relative'
    },
    sidebarItemActive: {
      backgroundColor: '#16a21a',
      color: 'white'
    },
    iconContainer: {
      marginRight: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    dropdownIndicator: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center'
    },
    dropdownMenu: {
      margin: 0,
      padding: 0
    },
    subItem: {
      paddingLeft: '40px',
      backgroundColor: 'rgba(224, 224, 224, 0.3)'
    },
    sidebarToggle: {
      display: 'block',
      position: 'fixed',
      top: '10px',
      left: isMobile ? (sidebarOpen ? '270px' : '10px') : '270px',
      zIndex: 20,
      backgroundColor: '#16A21A',
      color: 'white',
      border: 'none',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'left 0.3s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: '#16a21a',
      display: 'none'
    },
    activeIndicatorVisible: {
      display: 'block'
    },
    // mainContent: {
    //   marginLeft: isMobile ? '0' : '260px',
    //   transition: 'margin-left 0.3s ease',
    //   padding: '20px'
    // }
  };

  return (
    <>
      {/* Dark overlay that appears behind the sidebar on mobile */}
      <div style={styles.overlay} onClick={toggleSidebar} />
      
      {/* Toggle button */}
      <button 
        id="sidebar-toggle-button"
        style={{
          ...styles.sidebarToggle,
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      
      {/* Sidebar */}
      <div id="cropwise-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img 
            src="https://p7.hiclipart.com/preview/976/522/355/natural-environment-earth-ecology-clean-environment.jpg" 
            alt="CropWise Logo" 
            style={styles.sidebarLogo} 
          />
          <h2 style={styles.sidebarTitle}>CropWise</h2>
        </div>
        <ul style={styles.ul}>
          {SidebarDate.map((val, key) => (
            <React.Fragment key={key}>
              <li
                onClick={() => {
                  if (val.subMenu) {
                    toggleDropdown(key);
                  } else {
                    navigate(val.link);
                    if (isMobile) setSidebarOpen(false);
                  }
                }}
                style={{
                  ...styles.sidebarItem,
                  ...(location.pathname === val.link ? styles.sidebarItemActive : {})
                }}
              >
                <div 
                  style={{
                    ...styles.activeIndicator,
                    ...(location.pathname === val.link ? styles.activeIndicatorVisible : {})
                  }}
                />
                <div style={styles.iconContainer}>{val.icon}</div>
                <div>{val.title}</div>
                {val.subMenu && (
                  <div style={styles.dropdownIndicator}>
                    {openDropdown === key ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </div>
                )}
              </li>
              {val.subMenu && openDropdown === key && (
                <ul style={styles.dropdownMenu}>
                  {val.subMenu.map((subItem, subKey) => (
                    <li
                      key={subKey}
                      onClick={() => {
                        navigate(subItem.link);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      style={{
                        ...styles.sidebarItem,
                        ...styles.subItem,
                        ...(location.pathname === subItem.link ? styles.sidebarItemActive : {})
                      }}
                    >
                      <div 
                        style={{
                          ...styles.activeIndicator,
                          ...(location.pathname === subItem.link ? styles.activeIndicatorVisible : {})
                        }}
                      />
                      <div style={styles.iconContainer}>{subItem.icon}</div>
                      <div>{subItem.title}</div>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      
      {/* Wrapper for the main content area */}
      <div style={styles.mainContent}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;