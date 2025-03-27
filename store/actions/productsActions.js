import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFeturedProductsAPI } from "../../constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        fetchFeturedProductsAPI,
        "Error in fetching products",
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
