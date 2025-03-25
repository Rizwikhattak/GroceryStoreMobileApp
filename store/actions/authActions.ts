import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "../../utils/ApiCommon";
import { loginAPI } from "@/constants/apis";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "auth",
        "json",
        loginAPI,
        "Error in Login",
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in login");
    }
  }
);
