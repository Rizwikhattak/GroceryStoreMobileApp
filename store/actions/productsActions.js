import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFeturedProductsAPI, PRODUCTS_API } from "../../constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${fetchFeturedProductsAPI}?skip=30`,
        "Error in fetching products",
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getAllFeaturedProducts = createAsyncThunk(
  "products/getAllFeaturedProducts",
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      console.log("Calleeed", limit);
      const response = await API_COMMON(
        "getAll",
        "json",
        `${fetchFeturedProductsAPI}?limit=${limit}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async ({ _id = 0 }, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${PRODUCTS_API}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
