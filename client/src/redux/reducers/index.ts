import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import classReducer from "./class.reducer";
// import themeReducer from "./theme.reducer";

export const rootReducer = combineReducers({
  users: userReducer,
  classes: classReducer,
  // theme: themeReducer,
});
