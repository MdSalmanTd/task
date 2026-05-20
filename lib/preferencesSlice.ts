import { createSlice } from "@reduxjs/toolkit";
import type { ThemeMode } from "@/type";
import type { RootState } from "./store";

type PreferencesState = {
    themeMode: ThemeMode;
    gridView: boolean;
};

const initialState: PreferencesState = {
    themeMode: "light",
    gridView: true,
};

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        toggleThemeMode(state) {
            state.themeMode = state.themeMode === "light" ? "dark" : "light";
        },
        toggleGridView(state) {
            state.gridView = !state.gridView;
        },
    },
});

export const selectThemeMode = (state: RootState) => state.preferences.themeMode;
export const selectGridView = (state: RootState) => state.preferences.gridView;

export const { toggleGridView, toggleThemeMode } = preferencesSlice.actions;
export default preferencesSlice.reducer;
