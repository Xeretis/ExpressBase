import {
    LoginBody,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    RegisterBody,
    RegisterResponse,
} from "shared";

import api from "../api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegisterResponse, RegisterBody>({
            query: (body) => ({
                url: "/auth/register",
                method: "post",
                body,
            }),
        }),
        login: builder.mutation<LoginResponse, LoginBody>({
            query: (body) => ({
                url: "/auth/login",
                method: "post",
                body,
            }),
        }),
        refresh: builder.mutation<RefreshResponse, void>({
            query: () => "/auth/refresh",
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "delete",
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshMutation,
    useLogoutMutation,
} = authApi;
