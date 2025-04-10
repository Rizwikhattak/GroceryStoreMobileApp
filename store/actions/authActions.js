import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "../../utils/ApiCommon";
import { loginAPI } from "@/constants/apis";
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
