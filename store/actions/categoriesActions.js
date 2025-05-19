import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_COMMON } from "@/utils/ApiCommon";
import { fetchCategoriesApi, SUB_CATEGORIES_API } from "../../constants/apis";
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
export const getSubCategories = createAsyncThunk(
  "categories/getSubCategories",
  async (category, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${SUB_CATEGORIES_API}?category=${category}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
