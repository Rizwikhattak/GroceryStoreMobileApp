import {
  CUSTOMER_DETAILS_API,
  GET_CUSTOMER_DETAILS_API,
  PANTRY_PRODUCTS_API,
  SETTINGS_API,
} from "@/constants/apis";
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
export const getCustomerOrders = createAsyncThunk(
  "settings/getCustomerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "getAll",
        "json",
        `${SETTINGS_API.ORDERS}`,
        "Error in fetching products",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching products");
    }
  }
);

export const getUserProfileDetails = createAsyncThunk(
  "settings/getUserProfileDetails",
  async (_id, { rejectWithValue }) => {
    try {
      console.log("IDDDDDD", _id);
      const response = await API_COMMON(
        "getAll",
        "json",
        `${GET_CUSTOMER_DETAILS_API}${_id}`,
        "Error in fetching customer details",
        null
      );
      return response;
    } catch (err) {
      console.log("err", err);

      return rejectWithValue(
        err?.message || "Error in fetching customer details"
      );
    }
  }
);
export const updateUserProfileDetails = createAsyncThunk(
  "settings/updateUserProfileDetails",
  async (data, { rejectWithValue }) => {
    try {
      console.log("IDDDDDDDDDDDDDDDDD", data._id);
      const response = await API_COMMON(
        "put",
        "form",
        `${CUSTOMER_DETAILS_API}${data._id}`,
        "Error in updating customer details",
        data.formData
      );
      // console.log("DATA", response);
      return response;
    } catch (err) {
      console.log("err", err);
      return rejectWithValue(
        err?.message || "Error in updating customer details"
      );
    }
  }
);
export const downloadUserDriverLiscence = createAsyncThunk(
  "settings/downloadUserDriverLiscence",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API_COMMON(
        "put",
        "form",
        `${CUSTOMER_DETAILS_API}${data._id}`,
        "Error in updating customer details",
        data.formData
      );
      console.log("DATA", response);
      return response;
    } catch (err) {
      console.log("err", err);
      return rejectWithValue(
        err?.message || "Error in updating customer details"
      );
    }
  }
);
