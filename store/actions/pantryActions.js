import { PANTRY_API } from "@/constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const makeProductPantry = createAsyncThunk(
  "pantry/makeProductPantry",
  async (data, { rejectWithValue }) => {
    try {
      console.log("id", data.product);
      const response = await API_COMMON(
        "post",
        "json",
        `${PANTRY_API.PANTRY}`,
        // `${FEATURED_PRODUCTS_API}`,
        "Error in fetching products",
        data
      );
      console.log("response", response);
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getPantryProducts = createAsyncThunk(
  "pantry/getPantryProducts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${PANTRY_API.PANTRY}`,
        // `${FEATURED_PRODUCTS_API}`,
        "Error in fetching products",
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
