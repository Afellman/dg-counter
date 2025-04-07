import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PlusIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

export default function BottomNav() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useUser();

    const onClick = (event, newValue) => {
        navigate(newValue);
    };

    // Don't render the navigation if user is not authenticated or auth is still loading
    if (!isAuthenticated || loading) {
        return null;
    }

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
                <BottomNavigationAction label="Account" value="/account" icon={<AccountCircleIcon />} />
            </BottomNavigation>
        </Box>
    );
}
