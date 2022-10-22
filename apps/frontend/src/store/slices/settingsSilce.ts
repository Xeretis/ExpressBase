import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
    colorScheme: "dark" | "light";
}

const initialState: SettingsState = {
    colorScheme: "light",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setColorScheme: (state, action: PayloadAction<typeof initialState.colorScheme>) => {
            state.colorScheme = action.payload;
        },
    },
});

export const { setColorScheme } = settingsSlice.actions;

export default settingsSlice.reducer;
