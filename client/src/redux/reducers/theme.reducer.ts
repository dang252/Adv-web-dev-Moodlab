import { createReducer } from "@reduxjs/toolkit";

import { setTheme } from "../actions/user.action";

interface Theme {
    isDarkMode: boolean;
}

const initialState: Theme = {
    isDarkMode: false
};

const themeReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setTheme, (state) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode));
        })
});
export default themeReducer