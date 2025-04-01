import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import AgricultureIcon from '@mui/icons-material/Agriculture'; 
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ViewHeadlineRoundedIcon from '@mui/icons-material/ViewHeadlineRounded';


export const SidebarDate = [
    {
        title: "Crop Management",
        icon: <HomeIcon />,
        link: "/dashboard",
        subMenu: [
            {
                title: "show ",
                icon: <AddBoxRoundedIcon />,
                link: "/dashboard"
            },
  
        ]
    },
    {
        title: "Finance",
        icon: <HomeIcon />,
        link: "/home",
        subMenu: [
            {
                title: "show ",
                icon: <AddBoxRoundedIcon />,
                link: "/financeshow"
            },
  
        ]
    },
    {
        title: "Stock Management",
        icon: <EmailIcon />,
        link: "#",
        subMenu: [
            {
                title: "Add Items",
                icon: <AddBoxRoundedIcon />,
                link: "/addinventry"
            },
            {
                title: "Show Items",
                icon: <ViewHeadlineRoundedIcon />,
                link: "/inventryshow"
            }
        ]
    },
    {
        title: "Assign Task",
        icon: <CallIcon />,
        link: "#",
        subMenu: [
            {
                title: "Add Task",
                icon: <AddBoxRoundedIcon />,
                link: "/task"
            },
            {
                title: "Show Task",
                icon: <ViewHeadlineRoundedIcon />,
                link: "/showemployee"
            }
        ]
    },
    {
        title: "MarketPlace",
        icon: <DashboardIcon />,
        link: "#", // No link, acts as a dropdown
        link: "/show",
        subMenu: [
            {
                title: "Add Harvest",
                icon: <AddBoxRoundedIcon />,
                link: "/harvest"
            },
            {
                title: "Show Listning",
                icon: <ViewHeadlineRoundedIcon />,
                link: "/showall"
            }
        ]
    }
];
