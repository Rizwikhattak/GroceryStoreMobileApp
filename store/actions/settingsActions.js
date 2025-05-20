import { PANTRY_PRODUCTS_API, SETTINGS_API } from "@/constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getNotifications = createAsyncThunk(
  "settings/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${SETTINGS_API.NOTIFICATIONS}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
