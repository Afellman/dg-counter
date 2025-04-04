import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { userAtom, isAuthenticatedAtom, userDataAtom, isLoadingAtom } from "../atoms/userAtom";
import api from "../utils/api";

/**
 * Custom hook for user data with Jotai caching
 * This avoids running verification on every render
 */
const useUser = () => {
    const [, setUserState] = useAtom(userAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [user] = useAtom(userDataAtom);
    const [loading] = useAtom(isLoadingAtom);

    const verifyToken = useCallback(
        async (token) => {
            if (!token) {
                setUserState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                });
                return;
            }

            try {
                const data = await api.post("/api/auth/verify-token", { token });

                if (data.authenticated) {
                    setUserState({
                        isAuthenticated: true,
                        user: data.user,
                        loading: false,
                    });
                } else {
                    // Token is invalid
                    localStorage.removeItem("authToken");
                    setUserState({
                        isAuthenticated: false,
                        user: null,
                        loading: false,
                    });
                }
            } catch (error) {
                console.error("Token verification error:", error);
                localStorage.removeItem("authToken");
                setUserState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                });
            }
        },
        [setUserState],
    );

    // Set and verify a new token
    const setAuthToken = useCallback(
        (token) => {
            setUserState((prev) => ({
                ...prev,
                loading: true,
            }));
            verifyToken(token);
        },
        [verifyToken, setUserState],
    );

    // Verify token on hook initialization, but only if we haven't already loaded
    // and we're still in the loading state (prevents unnecessary verification)
    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("authToken");
            verifyToken(token);
        }
    }, [verifyToken, loading]);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setUserState({
            isAuthenticated: false,
            user: null,
            loading: false,
        });
    }, [setUserState]);

    return {
        isAuthenticated,
        user,
        loading,
        logout,
        setAuthToken,
    };
};

export default useUser;
