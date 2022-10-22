import { useLogoutMutation, useRefreshMutation } from "../../store/api/auth/authApi";

import dayjs from "dayjs";

class TokenRenewer {
    private static timeout: any;

    public static async start(refreshCallback: any, errorCallback: any, expiresAt: string) {
        clearTimeout(this.timeout);
        const timeout = dayjs(expiresAt).diff() - 5000;
        console.log("DEBUG: Token expiry thread sleep: " + timeout / 1000 + " seconds.");

        const callback = () => {
            this.timeoutCallback(refreshCallback, errorCallback);
        };

        this.timeout = setTimeout(callback, timeout);
    }

    public static stop = () => {
        clearTimeout(this.timeout);
    };

    private static timeoutCallback = async (refreshCallback: any, errorCallback: any) => {
        console.log("DEBUG: Renewing token...");
        try {
            await refreshCallback();
        } catch (e) {
            errorCallback(e);
        }
    };
}

export const useRenew = () => {
    const [refresh] = useRefreshMutation();
    const [logout] = useLogoutMutation();

    const renew = async (expiresAt: string) => {
        TokenRenewer.start(refreshCallback, errorCallback, expiresAt);
    };

    const refreshCallback = async () => {
        const res = await refresh().unwrap();
        renew(res.accessToken.expiresAt);
    };

    const errorCallback = async (err: Error) => {
        console.error(err);
        await logout();
    };

    return renew;
};
