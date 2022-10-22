import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, persistor, store } from "./store/store";

import { AppBootstrapProvider } from "./components/appBootstrapProvider";
import { AppRouter } from "./routes/appRouter";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import { PersistGate } from "redux-persist/integration/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { setColorScheme } from "./store/slices/settingsSilce";
import { useHotkeys } from "@mantine/hooks";

const App = () => {
    const colorScheme = useSelector((state: RootState) => state.settings.colorScheme);
    const dispatch = useDispatch();

    const toggleColorScheme = () => {
        dispatch(setColorScheme(colorScheme === "light" ? "dark" : "light"));
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <NotificationsProvider>
                    <AppBootstrapProvider>
                        {/* Now this may seem strange here but we really don't want the useEffect running twice in AppBootstrapProvider */}
                        <React.StrictMode>
                            <AppRouter />
                        </React.StrictMode>
                    </AppBootstrapProvider>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
