import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for authentication state and operations
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = useCallback(async (token) => {
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/verify-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.authenticated) {
                setIsAuthenticated(true);
                setUser(data.user);
            } else {
                // Token is invalid
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Token verification error:", error);
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Method to set and verify a new token
    const setAuthToken = useCallback(
        (token) => {
            setLoading(true);
            verifyToken(token);
        },
        [verifyToken],
    );

    // Verify token on hook initialization
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        verifyToken(token);
    }, [verifyToken]);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    return {
        isAuthenticated,
        user,
        loading,
        logout,
        setAuthToken,
    };
};

export default useAuth;
