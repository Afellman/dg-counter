import { Box, Container, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";

const TopBar = ({ back }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
        handleClose();
    };

    return (
        <Container sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {location.pathname !== "/" && (
                    <ArrowBackIosIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/${back ? back : ""}`)}
                    />
                )}
                <Typography variant="h6">DG Tracker</Typography>
                <Button
                    id="account-button"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    color="inherit"
                    startIcon={<AccountCircleIcon />}
                >
                    Account
                </Button>
                <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "account-button",
                    }}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Box>
        </Container>
    );
};

export default TopBar;
