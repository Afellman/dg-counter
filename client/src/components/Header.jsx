import { Box, Typography, useTheme } from "@mui/material";
import { useLocation, matchPath } from "react-router-dom";
import ROUTES from "../routes";

const Header = () => {
    const location = useLocation();
    const theme = useTheme();
    const backgroundColor = theme.palette.primary.main;

    const getTitle = () => {
        const match = ROUTES.find((route) =>
            matchPath({ path: route.path, end: !route.path.includes("*") }, location.pathname),
        );
        return match?.title || "DG Tracker";
    };

    return (
        <Box sx={{ backgroundColor, padding: "2rem" }}>
            <Typography variant="h3" textAlign="center" color="white">
                {getTitle()}
            </Typography>
        </Box>
    );
};

export default Header;
