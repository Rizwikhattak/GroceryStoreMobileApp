import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FEATURED_PRODUCTS_API,
  PANTRY_PRODUCTS_API,
  PRODUCTS_API,
} from "../../constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { tagPantryProducts } from "../../utils/Helpers";

export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const [featuredProdResp, pantryProdResp] = await Promise.all([
        API_COMMON(
          "getAll",
          "json",
          `${FEATURED_PRODUCTS_API}`,
          // `${FEATURED_PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
        API_COMMON(
          "getAll",
          "json",
          `${PANTRY_PRODUCTS_API}`,
          // `${FEATURED_PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
      ]);
      featuredProdResp.list = featuredProdResp?.list
        ? tagPantryProducts(featuredProdResp.list, pantryProdResp.list)
        : [];
      return featuredProdResp;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);

export const getAllFeaturedProducts = createAsyncThunk(
  "products/getAllFeaturedProducts",
  async ({ limit = 100 }, { rejectWithValue }) => {
    try {
      const [featuredProdResp, pantryProdResp] = await Promise.all([
        API_COMMON(
          "getAll",
          "json",
          `${FEATURED_PRODUCTS_API}?limit=${limit}`,
          "Error in fetching products",
          null
        ),
        API_COMMON(
          "getAll",
          "json",
          `${PANTRY_PRODUCTS_API}`,
          // `${FEATURED_PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
      ]);
      featuredProdResp.list = featuredProdResp?.list
        ? tagPantryProducts(featuredProdResp.list, pantryProdResp.list)
        : [];
      return featuredProdResp;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async ({ _id = 0, search = "" }, { rejectWithValue }) => {
    try {
      const [productsResponse, pantryProdResp] = await Promise.all([
        API_COMMON(
          "getAll",
          "json",
          `${PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
        API_COMMON(
          "getAll",
          "json",
          `${PANTRY_PRODUCTS_API}`,
          // `${FEATURED_PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
      ]);
      productsResponse.list = productsResponse?.list
        ? tagPantryProducts(productsResponse.list, pantryProdResp.list)
        : [];
      return productsResponse;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (
    { category_slug = "", sub_category = "", search = "", limit = 0 },
    { rejectWithValue }
  ) => {
    try {
      const url =
        limit !== 0
          ? `${PRODUCTS_API}?name=${search}&limit=${limit}&sub_category=${sub_category}&category_slug=${category_slug}`
          : `${PRODUCTS_API}?name=${search}&sub_category=${sub_category}&category_slug=${category_slug}`;
      console.log(url);
      const [productsResponse, pantryProdResp] = await Promise.all([
        API_COMMON("getAll", "json", url, "Error in fetching products", null),
        API_COMMON(
          "getAll",
          "json",
          `${PANTRY_PRODUCTS_API}`,
          // `${FEATURED_PRODUCTS_API}`,
          "Error in fetching products",
          null
        ),
      ]);
      console.log(productsResponse);
      productsResponse.list = productsResponse?.list
        ? tagPantryProducts(productsResponse.list, pantryProdResp.list)
        : [];
      return productsResponse;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);
