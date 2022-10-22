import { RootState } from "./../../store/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth);

    return auth;
};
