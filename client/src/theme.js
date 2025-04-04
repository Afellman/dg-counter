import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3d8361", // Forest green - representing disc golf courses
            light: "#65b48e",
            dark: "#1e5631",
        },
        secondary: {
            main: "#5e81ac", // Sky blue - like the open sky on a course
            light: "#81a1c1",
            dark: "#406185",
        },
        success: {
            main: "#a3be8c", // Soft green - like course fairways
            light: "#c0d9a0",
            dark: "#7b9f5e",
        },
        error: {
            main: "#bf616a", // Muted red
            light: "#d07a82",
            dark: "#99454d",
        },
        warning: {
            main: "#ebcb8b", // Warm amber - like autumn leaves on a course
            light: "#f2dca7",
            dark: "#c4a86d",
        },
        info: {
            main: "#88c0d0", // Light blue - like water hazards
            light: "#a3d5e4",
            dark: "#6d99a8",
        },
        background: {
            default: "#f7f7f7",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: "2.5rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 500,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",

                    // borderRadius: 4,
                    "&.Mui-disabled": {
                        backgroundColor: "#e0e0e0",
                        color: "#9e9e9e",
                        "&:hover": {
                            backgroundColor: "#e0e0e0",
                        },
                    },
                },
                containedSuccess: {
                    color: "#fff",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    // borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
