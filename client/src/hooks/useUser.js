import { useAtom } from "jotai";
import { authAtom } from "../atoms/userAtom";

/**
 *
 * @returns {import("../atoms/userAtom").UserType & import("../atoms/userAtom").AuthType & {userID: string}}
 */
const useUser = () => {
    const [auth] = useAtom(authAtom);

    return {
        ...auth,
        ...auth?.user,
        userID: auth?.user?._id,
    };
};

export default useUser;
