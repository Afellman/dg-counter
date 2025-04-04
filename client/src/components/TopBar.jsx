import { Box, Container, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const TopBar = () => {
    const location = useLocation();

    const handleBack = () => {
        // Always use browser's native back functionality
        window.history.back();
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
                    <ArrowBackIosIcon style={{ cursor: "pointer" }} onClick={handleBack} />
                )}
                <Typography variant="h6">DG Tracker</Typography>
                <Box sx={{ width: 24 }}></Box> {/* Empty space to balance the layout */}
            </Box>
        </Container>
    );
};

export default TopBar;
