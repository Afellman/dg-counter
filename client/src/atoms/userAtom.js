import { atom } from "jotai";

/**
 * @typedef UserType
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 *
 * @typedef AuthType
 * @property {boolean} isAuthenticated
 * @property {boolean} loading
 */

// Initial state for user
export const authAtom = atom({
    user: null,
    isAuthenticated: false,
    loading: true,
});
