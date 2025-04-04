import { useState, useEffect } from "react";
import { Box, Typography, OutlinedInput, Button, Container, Stack } from "@mui/material";
import Header from "./Header";

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("password");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = () => {
        if (password === "dgforlife") {
            localStorage.setItem("password", password);
            setIsAuthenticated(true);
        } else {
            alert("Invalid password");
        }
    };

    if (!isAuthenticated) {
        return (
            <Stack spacing={2}>
                <Header />
                <Container>
                    <Stack spacing={1}>
                        <Typography>Please login to continue</Typography>
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <OutlinedInput
                                sx={{ flex: 1 }}
                                placeholder="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleLogin}>
                                Login
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Stack>
        );
    }
    return <>{children}</>;
};

export default AuthWrapper;
