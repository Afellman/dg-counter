import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Layout from "./components/Layout.jsx";
import "./index.css";
import theme from "./theme";
import ROUTES from "./routes";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout>
                    <AuthWrapper>
                        <Routes>
                            {ROUTES.map((route) => (
                                <Route key={route.path} path={route.path} element={<route.element />} />
                            ))}
                        </Routes>
                    </AuthWrapper>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
