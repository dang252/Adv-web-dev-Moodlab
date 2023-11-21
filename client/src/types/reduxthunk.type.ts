import { AsyncThunk } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

export type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
export type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
export type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
