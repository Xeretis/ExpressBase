import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import api from "./api/api";
import authReducer from "./slices/authSlice";
import sessionStorage from "redux-persist/es/storage/session";
import settingsReducer from "./slices/settingsSilce";
import storage from "redux-persist/lib/storage";

const localPersistConfig = {
    key: "local_persist",
    storage,
    whitelist: ["settings"],
};

const sessionPersistConfig = {
    key: "session_persist",
    storage: sessionStorage,
};

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: persistReducer(sessionPersistConfig, authReducer),
    settings: settingsReducer,
});

const persistedReducer = persistReducer(localPersistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
