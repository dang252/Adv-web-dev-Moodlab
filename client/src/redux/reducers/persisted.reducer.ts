import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import userReducer from "./user.reducer";

const persistConfig = {
    key: 'persist-root',
    storage
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
    users: userReducer,
    // classes: classReducer,
    // theme: themeReducer,
}))

export default persistedReducer