import { Alert, Box, Button, OutlinedInput, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

const AuthWrapper = ({ children }) => {
    const { isAuthenticated, loading, verifyToken } = useAuth();
    const [email, setEmail] = useState("");
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [error, setError] = useState("");
    const [tokenProcessed, setTokenProcessed] = useState(false);

    useEffect(() => {
        // Check if there's a token in the URL (after magic link redirect)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token && !tokenProcessed) {
            // Store token and remove it from URL
            localStorage.setItem("authToken", token);
            window.history.replaceState({}, document.title, window.location.pathname);
            setTokenProcessed(true);

            // Instead of reloading, notify the auth hook about the new token
            verifyToken(token);
        } else if (loading) {
            const token = localStorage.getItem("authToken");
            verifyToken(token);
        }
    }, [tokenProcessed, verifyToken, loading]);

    const handleLogin = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            await api.post("/api/auth/login", { email });
            setMagicLinkSent(true);
            setError("");
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <Stack spacing={2}>
                <Typography>Loading...</Typography>
            </Stack>
        );
    }

    if (!isAuthenticated) {
        return (
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
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
