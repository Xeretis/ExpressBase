import { AccessToken, User } from "shared";

import type { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/auth/authApi";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    user?: User;
    accessToken?: AccessToken;
}

const initialState: AuthState = {
    user: undefined,
    accessToken: undefined,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
            state.user = undefined;
            state.accessToken = undefined;
        });
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        });
        builder.addMatcher(authApi.endpoints.refresh.matchFulfilled, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        });
    },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
