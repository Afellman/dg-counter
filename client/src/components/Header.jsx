import { Box, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
    "/": "DG Tracker",
    "/game": "New Game",
    "/game/player": "New Game",
};

const Header = ({ title }) => {
    const location = useLocation();

    const pathname = location.pathname;
    const theme = useTheme();
    const backgroundColor = theme.palette.primary.main;

    return (
        <Box sx={{ backgroundColor, padding: "2rem" }}>
            <Typography variant="h3" textAlign="center" color="white">
                {TITLE_MAP[pathname]}
            </Typography>
        </Box>
    );
};

export default Header;
