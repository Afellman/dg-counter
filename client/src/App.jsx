import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();
    return (
        <Stack spacing={2}>
            <Box sx={{ backgroundColor: "red", padding: "2rem" }}>
                <Typography variant="h3" textAlign="center">
                    DG Tracker
                </Typography>
            </Box>
            <Container sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate("/game");
                    }}
                >
                    Start new game
                </Button>
            </Container>
        </Stack>
    );
}

export default App;
