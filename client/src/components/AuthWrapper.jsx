import { Alert, Box, Button, OutlinedInput, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

const AuthWrapper = ({ children }) => {
    const { isAuthenticated, loading, verifyToken } = useAuth();
    const [email, setEmail] = useState("");
    const [passcode, setPasscode] = useState("");
    const [passcodeSent, setPasscodeSent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (loading) {
            const lsToken = localStorage.getItem("authToken");
            verifyToken(lsToken);
        }
    }, [verifyToken, loading]);

    const handleLogin = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            await api.post("/api/auth/login", { email });
            setPasscodeSent(true);
            setError("");
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred. Please try again.");
        }
    };

    const handleVerify = async () => {
        if (!passcode || passcode.length !== 6) {
            setError("Please enter a valid 6-digit passcode");
            return;
        }

        try {
            const response = await api.post("/api/auth/verify", { email, passcode });
            localStorage.setItem("authToken", response.token);
            verifyToken(response.token);
        } catch (error) {
            console.error("Verification error:", error);
            setError("Invalid passcode. Please try again.");
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
                {!passcodeSent ? (
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
                                Send Passcode
                            </Button>
                        </Stack>
                        {error && <Alert severity="error">{error}</Alert>}
                    </>
                ) : (
                    <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                        <Typography>Passcode sent!</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Check your email ({email}) for a 6-digit passcode. The passcode is valid for 1
                            hour.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <OutlinedInput
                                placeholder="Enter passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                            />
                            <Button variant="contained" onClick={handleVerify}>
                                Verify
                            </Button>
                        </Stack>
                        <Button variant="text" onClick={() => setPasscodeSent(false)} sx={{ mt: 2 }}>
                            Use a different email
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                )}
            </Stack>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
