import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import AgricultureIcon from '@mui/icons-material/Agriculture'; 
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ViewHeadlineRoundedIcon from '@mui/icons-material/ViewHeadlineRounded';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

export const SidebarDate = [
    {
        title: "Crop Management",
        icon: <HomeIcon />,
        link: "/dashboard",
        subMenu: [
            {
                title: "show ",
                icon: <ViewHeadlineRoundedIcon />,
                link: "/dashboard"
            },
            {
                title: "Moisture Level",
                icon: <AutoFixHighIcon />,
                externalLink: "https://app.arduino.cc/dashboards/48ef7fd6-1a94-4b52-8adf-8b74496dbe81"
            },
        ]
    },
    {
        title: "Finance",
        icon: <ShowChartIcon />,
        link: "/home",
        subMenu: [
            {
                title: "show ",
                icon: <ViewHeadlineRoundedIcon />,
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
                link: "/showtask"
            }
        ]
    },
    {
        title: "MarketPlace",
        icon: <DashboardIcon />,
        link: "#",
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
            },
            {
                title: "Show order",
                icon: <ShoppingCartCheckoutIcon />,
                link: "/showorder"
            },
        ]
    }
];
