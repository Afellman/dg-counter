import { Box, Typography, useTheme } from "@mui/material";

const Header = ({ title }) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.primary.main;

    return (
        <Box sx={{ backgroundColor, padding: "2rem" }}>
            <Typography variant="h3" textAlign="center" color="white">
                {title}
            </Typography>
        </Box>
    );
};

export default Header;
