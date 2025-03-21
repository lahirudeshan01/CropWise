import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarDate } from "./SidebarDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="Sidebar">
      <ul>
        {SidebarDate.map((val, key) => (
          <React.Fragment key={key}>
            <li
              onClick={() => {
                if (val.subMenu) {
                  toggleDropdown(key);
                } else {
                  navigate(val.link);
                }
              }}
              className={`sidebar-item ${location.pathname === val.link ? "active" : ""}`}
            >
              <div>{val.icon}</div>
              <div>{val.title}</div>
              {val.subMenu && (
                <div style={{ marginLeft: "auto" }}>
                  {openDropdown === key ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              )}
            </li>

            {/* Render dropdown if open */}
            {val.subMenu && openDropdown === key && (
              <ul className="dropdown-menu">
                {val.subMenu.map((subItem, subKey) => (
                  <li
                    key={subKey}
                    onClick={() => navigate(subItem.link)}
                    className={`sidebar-item sub-item ${
                      location.pathname === subItem.link ? "active" : ""
                    }`}
                  >
                    <div>{subItem.icon}</div>
                    <div>{subItem.title}</div>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
