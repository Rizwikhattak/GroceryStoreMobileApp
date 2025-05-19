import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "@/utils/ApiCommon";
import { fetchCategoriesApi } from "../../constants/apis";
export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${fetchCategoriesApi}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
