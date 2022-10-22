import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../store";

const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        prepareHeaders: (headers, { getState }) => {
            const accessToken = (getState() as RootState).auth.accessToken;
            if (accessToken) {
                headers.set("authorization", `Bearer ${accessToken.token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});

export default api;
