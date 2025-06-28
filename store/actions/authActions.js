import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "../../utils/ApiCommon";
import {
  CONTACT_US_API,
  loginAPI,
  REGISTRATION_CREDIT_API,
  REGISTRATION_STEP_API,
  PASWORT_RESET_API,
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

      return {
        isAuthenticated: true,
        token: token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const contactUs = createAsyncThunk(
  "auth/contactUs",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Woww what a data", data);
      const response = await API_COMMON(
        "post",
        "json",
        CONTACT_US_API,
        "Error in contact us",
        data
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in contact us");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Woww what a data", data);
      const response = await API_COMMON(
        "post",
        "json",
        PASWORT_RESET_API,
        "Error in contact us",
        data
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(err?.message || "Error in contact us");
    }
  }
);
