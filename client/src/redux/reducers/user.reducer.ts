import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";

import { setTheme } from "../actions/user.action";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";
import { UserAccount } from "../../types/user";
import axios from "axios";

// Interface declair
interface UserState {
  currentId: string; // id for state action
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  isDarkMode: boolean;
  isLoading: boolean; // global variable
  isError: boolean; // global variable
}

// createAsyncThunk middleware
export const registerAccount = createAsyncThunk(
  "user/register_account",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (account: UserAccount, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          // signal: thunkAPI.signal,
          username: account.username,
          email: account.email,
          password: account.password,
          first_name: account.firstname,
          last_name: account.lastname,
          role: "STUDENT"
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



// InitialState value
const initialState: UserState = {
  currentId: "",
  username: "",
  password: "",
  firstname: "",
  lastname: "",
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
    .addCase(registerAccount.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerAccount.fulfilled, (state, action) => {
      if (action.payload) {
        // console.log("CHECK register from redux: ", action.payload);
      }
      state.isLoading = false;
    })
    .addCase(registerAccount.rejected, (state) => {
      state.isLoading = false;
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
