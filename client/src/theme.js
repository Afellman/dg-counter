import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // A nice blue color
            light: "#42a5f5",
            dark: "#1565c0",
        },
        secondary: {
            main: "#9c27b0", // A purple color
            light: "#ba68c8",
            dark: "#7b1fa2",
        },
        success: {
            main: "#4caf50", // A better green color
            light: "#81c784",
            dark: "#388e3c",
        },
        error: {
            main: "#d32f2f", // A red color
            light: "#ef5350",
            dark: "#c62828",
        },
        warning: {
            main: "#ed6c02", // An orange color
            light: "#ff9800",
            dark: "#e65100",
        },
        info: {
            main: "#0288d1", // A light blue color
            light: "#03a9f4",
            dark: "#01579b",
        },
        background: {
            default: "#f5f5f5",
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
