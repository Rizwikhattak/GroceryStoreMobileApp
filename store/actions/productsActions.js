import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFeturedProductsAPI,
  PANTRY_PRODUCTS_API,
  PRODUCTS_API,
} from "../../constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${fetchFeturedProductsAPI}?skip=30`,
        // `${fetchFeturedProductsAPI}`,
        "Error in fetching products",
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getPantryProducts = createAsyncThunk(
  "products/getPantryProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${PANTRY_PRODUCTS_API}`,
        "Error in fetching products",
        null
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
  async ({ _id = 0, search = "" }, { rejectWithValue }) => {
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
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (
    { category_slug = null, sub_category = null, search = "", limit = 100 },
    { rejectWithValue }
  ) => {
    try {
      const url =
        sub_category !== null
          ? `${PRODUCTS_API}?sub_category=${sub_category}`
          : category_slug !== null
          ? `${PRODUCTS_API}?category_slug=${category_slug}`
          : `${PRODUCTS_API}?name=${search}&limit=${limit}`;
      console.log(url);
      const response = await API_COMMON(
        "getAll",
        "json",
        url,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
