import { createReducer } from "@reduxjs/toolkit";

import { setTheme } from "../actions/user.action";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";

// Interface declair
interface UserState {
  currentId: string; // id for state action
  username: string;
  password: string;
  name: string;
  isDarkMode: boolean;
  isLoading: boolean; // global variable
  isError: boolean; // global variable
}

// createAsyncThunk middleware

// InitialState value
const initialState: UserState = {
  currentId: "",
  username: "",
  password: "",
  name: "",
  isDarkMode: false,
  isLoading: false,
  isError: false,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setTheme, (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode));
    })
    .addMatcher(
      (action): action is PendingAction => action.type.endsWith("/pending"),
      (state, action) => {
        state.currentId = action.meta.requestId;
        if (state.currentId === action.meta.requestId) {
          state.isLoading = true;
        }
      }
    )
    .addMatcher(
      (action): action is FulfilledAction => action.type.endsWith("/fulfilled"),
      (state, action) => {
        if (state.isLoading && state.currentId === action.meta.requestId) {
          state.isLoading = false;
          state.isError = false;
        }
      }
    )
    .addMatcher(
      (action): action is RejectedAction => action.type.endsWith("/rejected"),
      (state, action) => {
        if (state.isLoading && state.currentId === action.meta.requestId) {
          state.isLoading = false;
          state.isError = true;
        }
      }
    );
});

export default userReducer;
