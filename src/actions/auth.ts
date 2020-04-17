import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import Request from "utils/api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const login = createAsyncThunk("auth/login", (body: LoginRequest) => {
  return Request.post<LoginResponse>("login", body);
});

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  name: string;
}

export interface RegisterResponse {
  access_token: string;
}

export const register = createAsyncThunk(
  "auth/register",
  (body: RegisterRequest) =>
    Request.post<RegisterResponse>("registrations", body),
);

export const logout = createAction("auth/logout");
