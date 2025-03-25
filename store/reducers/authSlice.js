import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isLoading: false,
  error: null,
  data: {},
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        storeTokenToStorage(action.payload.token);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
