import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { Container, Stack, Box } from "@mui/material";
import Header from "./Header";
import useUser from "../hooks/useUser";

const Layout = ({ children }) => {
    const { isAuthenticated } = useUser();

    return (
        <Box sx={{ pb: isAuthenticated ? 9 : 2, maxWidth: "700px", margin: "0 auto" }}>
            <TopBar />
            <Stack spacing={2}>
                <Header />
                <Container>{children}</Container>
            </Stack>
            <BottomNav />
        </Box>
    );
};

export default Layout;
