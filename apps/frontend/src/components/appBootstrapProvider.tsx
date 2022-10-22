import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store/store";
import dayjs from "dayjs";
import { setCredentials } from "../store/slices/authSlice";
import { useEffect } from "react";
import { useRefreshMutation } from "../store/api/auth/authApi";
import { useRenew } from "../hooks/auth/useRenew";

export const AppBootstrapProvider = ({ children }: { children: React.ReactNode }) => {
    const [refresh, { isLoading }] = useRefreshMutation();
    const tokenState = useSelector((state: RootState) => state.auth.accessToken);
    const renew = useRenew();
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (tokenState && dayjs(tokenState.expiresAt).isAfter(dayjs())) {
                renew(tokenState.expiresAt);
            } else {
                dispatch(setCredentials({ user: undefined, accessToken: undefined }));
                try {
                    const res = await refresh().unwrap();
                    console.log("DEBUG: Token refreshed");
                    renew(res.accessToken.expiresAt);
                } catch (err) {
                    console.warn(err);
                }
            }
        })();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};
