import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";

import { setTheme } from "../actions/user.action";

import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from "../../types/reduxthunk.type";
import { JwtPayload, UserAccount } from "../../types/user";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Interface declair
interface UserState {
  currentId: string; // id for state action
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
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

export const loginAccount = createAsyncThunk(
  "user/login_account",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (account: UserAccount, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          // signal: thunkAPI.signal,
          username: account.username,
          password: account.password,
        }
      );
      const accessToken: string = response.data.access_token
      const decodedToken = jwtDecode(accessToken) as JwtPayload
      const userId = decodedToken.sub;
      const username = account.username
      return {...response.data, userId, username}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const getUser = createAsyncThunk(
  "user/get_user",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const refresh = createAsyncThunk(
  "user/refresh",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage
        .getItem("refreshToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          //null data
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          }
        }
      );
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutAccount = createAsyncThunk(
  "user/logout_account",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          //null data
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        },
      );
      return response.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const stopLoad = () => ({
  type: 'STOP_LOADING',
});

// InitialState value
const initialState: UserState = {
  currentId: "",
  username: "",
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  role: "",
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
    .addCase(registerAccount.pending, () => {
      
    })
    .addCase(registerAccount.fulfilled, (_, action) => {
      if (action.payload) {
        // console.log("CHECK register from redux: ", action.payload);
      }
    })
    .addCase(registerAccount.rejected, (_) => {
    })
     .addCase(loginAccount.pending, (_) => {
    })
    .addCase(loginAccount.fulfilled, (state, action) => {
      if (action.payload) {
        // console.log("CHECK login from redux: ", action.payload);
        const accessToken: string = action.payload.access_token;
        const refreshToken: string = action.payload.refresh_token;
        console.log(action.payload)
        // const decodedToken = jwtDecode(accessToken) as JwtPayload
        state.currentId = action.payload.userId;
        state.username = action.payload.username;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

      }
    })
    .addCase(loginAccount.rejected, () => {
    })
    .addCase(getUser.pending, () => {
    })
    .addCase(getUser.rejected, () => {
    })
    .addCase(getUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.lastname = action.payload.lastname;
        state.firstname = action.payload.firstname;
        state.email = action.payload.email;
        state.role = action.payload.role;
      }
    })
    .addCase(refresh.pending, () => {
    })
    .addCase(refresh.rejected, () => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return initialState;
    })
    .addCase(refresh.fulfilled, (_, action) => {
      if (action.payload) {
        const accessToken: string = action.payload.access_token;
        const refreshToken: string = action.payload.refresh_token;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      }
    })
    .addCase(logoutAccount.pending, () => {
    })
    .addCase(logoutAccount.rejected, () => {
    })
    .addCase(logoutAccount.fulfilled, () => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return initialState;
    })
    .addCase("STOP_LOADING", (state) => {
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
