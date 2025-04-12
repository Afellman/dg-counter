import { Box, Container, Stack } from "@mui/material";
import useUser from "../hooks/useUser";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
    const { isAuthenticated } = useUser();

    return (
        <Box sx={{ pb: isAuthenticated ? 9 : 2, maxWidth: "700px", margin: "0 auto" }}>
            <TopBar />
            <Stack
                spacing={2}
                sx={{
                    paddingTop: "58px",
                    paddingBottom: "16px",
                    minHeight: "calc(100dvh - 72px)",
                    position: "relative",
                }}
            >
                {/* <Header /> */}
                <Container>{children}</Container>
            </Stack>
            <BottomNav />
        </Box>
    );
};

export default Layout;
