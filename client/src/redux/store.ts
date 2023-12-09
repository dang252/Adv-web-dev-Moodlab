import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/index";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store)
