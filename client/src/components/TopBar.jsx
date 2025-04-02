import { Box, Container, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
                    <ArrowBackIosIcon style={{ cursor: "pointer" }} onClick={() => navigate(`/`)} />
                )}
                <Typography variant="h6">DG Tracker</Typography>
            </Box>
        </Container>
    );
};

export default TopBar;
