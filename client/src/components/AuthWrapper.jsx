import { useState, useEffect } from "react";
import { Box, Typography, OutlinedInput, Button, Container, Stack, Alert } from "@mui/material";
import Header from "./Header";

const AuthWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if there's a token in the URL (after magic link redirect)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Store token and remove it from URL
            localStorage.setItem("authToken", token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check token validity
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            verifyToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch("/api/auth/verify-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.authenticated) {
                setIsAuthenticated(true);
            } else {
                // Token is invalid, remove it
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Token verification error:", error);
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMagicLinkSent(true);
                setError("");
            } else {
                setError(data.message || "Failed to send magic link");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <Stack spacing={2}>
                <Header title="DG Tracker" />
                <Container>
                    <Typography>Loading...</Typography>
                </Container>
            </Stack>
        );
    }

    if (!isAuthenticated) {
        return (
            <Stack spacing={2}>
                <Header title="DG Tracker" />
                <Container>
                    <Stack spacing={2}>
                        {!magicLinkSent ? (
                            <>
                                <Typography>Sign in with your email</Typography>
                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                    <OutlinedInput
                                        sx={{ flex: 1 }}
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                                    />
                                    <Button variant="contained" onClick={handleLogin}>
                                        Send Login Link
                                    </Button>
                                </Stack>
                                {error && <Alert severity="error">{error}</Alert>}
                            </>
                        ) : (
                            <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                                <Typography>Magic link sent!</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Check your email ({email}) for a login link. The link is valid for 1 hour.
                                </Typography>
                                <Button variant="text" onClick={() => setMagicLinkSent(false)} sx={{ mt: 2 }}>
                                    Use a different email
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Stack>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
