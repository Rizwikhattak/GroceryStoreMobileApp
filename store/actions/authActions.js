import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "../../utils/ApiCommon";
import {
  loginAPI,
  REGISTRATION_CREDIT_API,
  REGISTRATION_STEP_API,
} from "@/constants/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in login");
    }
  }
);
export const registrationStep1 = createAsyncThunk(
  "auth/registrationStep1",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "auth",
        "form",
        REGISTRATION_STEP_API,
        "Error in Registration",
        data
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in Registration");
    }
  }
);
export const registrationStep2 = createAsyncThunk(
  "auth/registrationStep2",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Woww what a data", data);
      const response = await API_COMMON(
        "put",
        "json",
        `${REGISTRATION_STEP_API}${data._id}`,
        "Error in Registration",
        data.formData
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in Registration");
    }
  }
);
export const registrationStep3 = createAsyncThunk(
  "auth/registrationStep3",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Woww what a data", data);
      const response = await API_COMMON(
        "put",
        "json",
        `${REGISTRATION_CREDIT_API}${data._id}`,
        "Error in Registration",
        data.formData
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in Registration");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("Authorization");

      if (!token) {
        return rejectWithValue("No token found");
      }

      // Here you could validate the token with your backend if needed
      // For now, we'll assume the token is valid if it exists

      // You may need to fetch the user data from your API using the token
      // For example:
      // const userData = await fetchUserData(token);
      // return { user: userData, token };

      // For simplicity, returning a basic structure
      return {
        isAuthenticated: true,
        token: token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
