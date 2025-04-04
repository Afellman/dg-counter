import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { Container, Stack } from "@mui/material";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <>
            <TopBar />
            <Stack spacing={2}>
                <Header />
                <Container>{children}</Container>
            </Stack>
            <BottomNav />
        </>
    );
};

export default Layout;
