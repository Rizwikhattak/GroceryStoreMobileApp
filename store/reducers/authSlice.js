import { createSlice } from "@reduxjs/toolkit";
import {
  checkAuthStatus,
  loginUser,
  registrationStep1,
  registrationStep2,
  registrationStep3,
} from "../actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";

const initialState = {
  isLoading: false,
  error: null,
  data: {},
  isAuthenticated: false,
  token: "",
};
const storeTokenToStorage = async (value) => {
  try {
    await AsyncStorage.setItem("Authorization", value);

    console.log("Data stored successfully!");
  } catch (e) {
    console.error("Error saving value:", e);
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {};
      state.token = "";
      state.isAuthenticated = false;
      AsyncStorage.removeItem("Authorization");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.token = action.payload.token;
        storeTokenToStorage(action.payload.token);
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        Toast.error(
          "Invalid Credentials,Enter valid email and password",
          "bottom"
        );
      })
      .addCase(registrationStep1.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registrationStep1.fulfilled, (state, action) => {
        // state.data = action.payload.user;
        console.log("Response", action.payload);
        // state.token = action.payload.token;
        // storeTokenToStorage(action.payload.token);
        // state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registrationStep1.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        Toast.error(
          "Invalid Credentials,Enter valid email and password",
          "bottom"
        );
      })
      .addCase(registrationStep2.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registrationStep2.fulfilled, (state, action) => {
        // state.data = action.payload.user;
        console.log("Response", action.payload);
        // state.token = action.payload.token;
        // storeTokenToStorage(action.payload.token);
        // state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registrationStep2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        Toast.error(
          "Invalid Credentials,Enter valid email and password",
          "bottom"
        );
      })
      .addCase(registrationStep3.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registrationStep3.fulfilled, (state, action) => {
        // state.data = action.payload.user;
        console.log("Response", action.payload);
        // state.token = action.payload.token;
        // storeTokenToStorage(action.payload.token);
        // state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registrationStep3.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        Toast.error(
          "Invalid Credentials,Enter valid email and password",
          "bottom"
        );
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.data = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
