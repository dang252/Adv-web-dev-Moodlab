import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
// import themeReducer from "./theme.reducer";

export const rootReducer = combineReducers({
  users: userReducer,
  // theme: themeReducer,
});
