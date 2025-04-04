import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { Container, Stack, Box } from "@mui/material";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <Box sx={{ pb: 9, maxWidth: "700px", margin: "0 auto" }}>
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
