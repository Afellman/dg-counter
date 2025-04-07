import { Button, Container, Stack, Typography } from "@mui/material";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const Account = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return (
        <Stack spacing={3}>
            {user && (
                <Stack spacing={1}>
                    <Typography>
                        <strong>Email:</strong> {user.email}
                    </Typography>
                    {user.name && (
                        <Typography>
                            <strong>Name:</strong> {user.name}
                        </Typography>
                    )}
                </Stack>
            )}

            <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
            </Button>
        </Stack>
    );
};

export default Account;
