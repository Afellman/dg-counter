import { useAtom } from "jotai";
import { useCallback } from "react";
import { authAtom } from "../atoms/userAtom";
import api from "../utils/api";

const useAuth = () => {
    const [authState, setAuthState] = useAtom(authAtom);

    const { loading, isAuthenticated } = authState;

    const verifyToken = useCallback(
        async (token) => {
            if (!token) {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                });
                return;
            }

            try {
                const data = await api.post("/api/auth/verify-token", { token });

                if (data.authenticated) {
                    setAuthState({
                        isAuthenticated: true,
                        user: data.user,
                        loading: false,
                    });
                } else {
                    // Token is invalid
                    localStorage.removeItem("authToken");
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        loading: false,
                    });
                }
            } catch (error) {
                console.error("Token verification error:", error);
                localStorage.removeItem("authToken");
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                });
            }
        },
        [setAuthState],
    );

    // Set and verify a new token
    const setAuthToken = useCallback(
        (token) => {
            setAuthState((prev) => ({
                ...prev,
                loading: true,
            }));
            verifyToken(token);
        },
        [verifyToken, setAuthState],
    );

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
        });
    }, [setAuthState]);

    return {
        isAuthenticated,
        loading,
        verifyToken,
        logout,
        setAuthToken,
    };
};

export default useAuth;
