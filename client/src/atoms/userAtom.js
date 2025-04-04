import { atom } from "jotai";

// Initial state for user
export const userAtom = atom({
    user: null,
    isAuthenticated: false,
    loading: true,
});

// A derived atom for checking if the user is authenticated
export const isAuthenticatedAtom = atom((get) => get(userAtom).isAuthenticated);

// A derived atom for getting the user data
export const userDataAtom = atom((get) => get(userAtom).user);

// A derived atom for checking if the user data is loading
export const isLoadingAtom = atom((get) => get(userAtom).loading);
