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
        <Box sx={{ width: "100%", position: "absolute", bottom: 0 }}>
            <BottomNavigation showLabels value={pathname} onChange={onClick}>
                <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
                <BottomNavigationAction label="Latest" value="/latest" icon={<NotificationsIcon />} />
                <BottomNavigationAction label="New Game" value="/game" icon={<PlusIcon />} />
            </BottomNavigation>
        </Box>
    );
}
