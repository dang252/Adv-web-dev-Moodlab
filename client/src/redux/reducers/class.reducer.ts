import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";

// Interface declair
interface ClassState {
  currentId: string;
  classCode: string;
  isLoading: boolean;
  isError: boolean;
  classList: any[];
}

// InitialState value
const initialState: ClassState = {
  currentId: "",
  classCode: "",
  isLoading: false,
  isError: false,
  classList: [],
};

export const getClasses = createAsyncThunk(
  "class/getClasses",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewClass = createAsyncThunk(
  "class/createNewClass",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (
    newClass: { code: string; name: string; subject: string },
    thunkAPI
  ) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/classes`,
        {
          code: newClass.code,
          name: newClass.name,
          subject: newClass.subject,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const classReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getClasses.fulfilled, (state, action) => {
      state.classList = action.payload;
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

export default classReducer;
