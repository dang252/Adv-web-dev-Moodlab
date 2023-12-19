import { combineReducers } from "@reduxjs/toolkit";
import classReducer from "./class.reducer";
import persistedReducer from "./persisted.reducer";

export const rootReducer = combineReducers({
  persisted: persistedReducer,
  classes: classReducer,
  // theme: themeReducer,
});
