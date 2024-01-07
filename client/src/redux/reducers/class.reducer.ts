import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";

import { ClassType, Grade, Review } from "../../types/classroom";

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
  detailClass: ClassType | null;
  detailClassGrades: Grade[];
  detailClassReviews: Review[];
}

// InitialState value
const initialState: ClassState = {
  currentId: "",
  classCode: "",
  isLoading: false,
  isError: false,
  classList: [],
  detailClass: null,
  detailClassGrades: [],
  detailClassReviews: [],
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

export const getDetailClass = createAsyncThunk(
  "class/getDetailClass",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (inviteCode: string, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${inviteCode}`,
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

export const editClassTheme = createAsyncThunk(
  "class/editClassTheme",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (body: { id: string; theme: string }, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/classes/${body.id}`,
        {
          theme: body.theme,
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

export const inviteToClassByEmail = createAsyncThunk(
  "class/inviteToClassByEmail",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (body: { id: number; email: string }, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/classes/${body.id}/invite`,
        {
          email: body.email,
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

export const getInviteCode = createAsyncThunk(
  "class/getInviteCode",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (body: { code: string }, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/join/${body.code}`,
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

export const getClassMembers = createAsyncThunk(
  "class/getClassMembers",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (body: { id: string }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${body.id}/members`
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getClassGradeStructure = createAsyncThunk(
  "class/getClassGradeStructure",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (classId: string, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${classId}/grades`,
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

export const postClassGradeStructure = createAsyncThunk(
  "class/postClassGradeStructure",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (body: { classId: string; gradeStructure: any[] }, thunkAPI) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/classes/${body.classId}/grades`,
        {},
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

export const getClassAllGrades = createAsyncThunk(
  "class/getClassAllGrades",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (classId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${classId}/points`
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getClassAllReviews = createAsyncThunk(
  "class/getClassAllReviews",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async (classId: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${classId}/reviews`
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

    .addCase(getClasses.rejected, (state, _) => {
      state.classList = [];
    })

    .addCase(getDetailClass.fulfilled, (state, action) => {
      state.detailClass = action.payload;
    })

    .addCase(getDetailClass.rejected, (state, _) => {
      state.detailClass = null;
    })

    .addCase(getClassGradeStructure.fulfilled, (state, action) => {
      if (state.detailClass) {
        state.detailClass.gradeStructure = [...action.payload];
      }
    })

    .addCase(getClassGradeStructure.rejected, (state, _) => {
      if (state.detailClass) {
        state.detailClass.gradeStructure = null;
      }
    })

    .addCase(postClassGradeStructure.fulfilled, (state, action) => {
      if (state.detailClass) {
        state.detailClass.gradeStructure = [...action.payload];
      }
    })

    .addCase(getClassAllGrades.fulfilled, (state, action) => {
      state.detailClassGrades = action.payload;
    })

    .addCase(getClassAllReviews.fulfilled, (state, action) => {
      state.detailClassReviews = action.payload.reviews;
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
