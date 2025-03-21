import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Icon for Harvest

export const SidebarDate = [
    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/home"
    },
    {
        title: "Add Member",
        icon: <EmailIcon />,
        link: "/add-member"
    },
    {
        title: "Contact",
        icon: <CallIcon />,
        link: "/contact"
    },
    {
        title: "MarketPlace",
        icon: <DashboardIcon />,
        link: "#", // No link, acts as a dropdown
        link: "/show",
        subMenu: [
            {
                title: "Add Harvest",
                icon: <AgricultureIcon />,
                link: "/harvest"
            },
            {
                title: "Show Listning",
                icon: <AgricultureIcon />,
                link: "/showall"
            }
        ]
    }
];
