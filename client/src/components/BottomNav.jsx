import HomeIcon from "@mui/icons-material/Home";
import PlusIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onClick = (event, newValue) => {
        navigate(newValue);
    };

    return (
        <Box
            sx={{
                width: "100%",
                boxShadow: 3,
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                maxWidth: "700px",
                margin: "0 auto",
            }}
        >
            <BottomNavigation showLabels value={pathname} onChange={onClick}>
                <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
                <BottomNavigationAction label="Latest" value="/latest" icon={<NotificationsIcon />} />
                <BottomNavigationAction label="New Game" value="/game" icon={<PlusIcon />} />
            </BottomNavigation>
        </Box>
    );
}
