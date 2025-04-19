import { Button, Container, Stack, Typography, Paper, Divider, Box } from "@mui/material";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import api from "../utils/api";
import useUser from "../hooks/useUser";

const Account = () => {
    const { user } = useUser();
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        lastPlayed: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Using your existing API utility to fetch user stats
    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user || !user._id) return;

            setLoading(true);
            setError(null);

            try {
                // Assuming your API endpoint structure
                const data = await api.get(`/api/users/${user.id}/stats`);
                setStats({
                    gamesPlayed: data.gamesPlayed || 0,
                    averageScore: data.averageScore || 0,
                    bestScore: data.bestScore || 0,
                    lastPlayed: data.lastPlayed ? new Date(data.lastPlayed).toLocaleDateString() : null,
                });
            } catch (err) {
                console.error("Failed to fetch user statistics:", err);
                setError("Failed to load your game statistics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return (
        <Stack spacing={4}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Account
            </Typography>

            {user && (
                <>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Profile Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Typography>
                                <strong>Email:</strong> {user.email}
                            </Typography>
                            {user.name && (
                                <Typography>
                                    <strong>Name:</strong> {user.name}
                                </Typography>
                            )}
                            <Typography>
                                <strong>Member since:</strong>{" "}
                                {user.joinDate || new Date().toLocaleDateString()}
                            </Typography>
                        </Stack>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Game Statistics
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Typography>
                                <strong>Games Played:</strong> {stats.gamesPlayed}
                            </Typography>
                            {/* //FIXME This wont work until we can match players to users */}
                            {/* <Typography>
                                <strong>Average Score:</strong> {stats.averageScore}
                            </Typography>
                            <Typography>
                                <strong>Best Score:</strong> {stats.bestScore}
                            </Typography>
                            <Typography>
                                <strong>Last Played:</strong> {stats.lastPlayed || "Never"}
                            </Typography> */}
                        </Stack>
                    </Paper>

                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                            sx={{ minWidth: "120px" }}
                        >
                            Logout
                        </Button>
                    </Box>
                </>
            )}
        </Stack>
    );
};

export default Account;
