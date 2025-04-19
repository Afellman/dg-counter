import { Box, Container, Typography, useTheme } from "@mui/material";
import { matchPath, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ROUTES from "../routes";

const TopBar = () => {
    const location = useLocation();
    const theme = useTheme();

    const getTitle = () => {
        const match = ROUTES.find((route) =>
            matchPath({ path: route.path, end: !route.path.includes("*") }, location.pathname),
        );
        return match?.title || "DG TRACKER";
    };

    const handleBack = () => {
        // Always use browser's native back functionality
        window.history.back();
    };

    return (
        <Container
            sx={{
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                boxShadow: 1,
                position: "fixed",
                top: 0,
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                zIndex: 1,
                maxWidth: "700px !important",
                // backdropFilter: "blur(10px);",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {location.pathname !== "/" && (
                    <ArrowBackIosIcon style={{ cursor: "pointer" }} onClick={handleBack} />
                )}
                <Typography variant="h5">{getTitle()}</Typography>
                <Box sx={{ width: 24 }}></Box> {/* Empty space to balance the layout */}
            </Box>
        </Container>
    );
};

export default TopBar;
