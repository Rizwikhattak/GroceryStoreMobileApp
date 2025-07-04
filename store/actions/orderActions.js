import { ORDERS_API } from "@/constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const placeCustomerOrder = createAsyncThunk(
  "order/placeCustomerOrder",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const response = await API_COMMON(
        "post",
        "json",
        `${ORDERS_API.ORDERS}`,
        "Error in placing order",
        data
      );
      // console.log("DATA", response);
      return response;
    } catch (err) {
      console.log("err", err);
      return rejectWithValue(err?.message || "Error in placing order");
    }
  }
);
export const getCustomerOrderByID = createAsyncThunk(
  "order/getCustomerOrderByID",
  async (id, { rejectWithValue }) => {
    try {
      console.log("id", id);
      const response = await API_COMMON(
        "getAll",
        "json",
        `${ORDERS_API.ORDERS}${id}`,
        "Error in placing order",
        null
      );
      // console.log("DATA", response);
      return response;
    } catch (err) {
      console.log("err", err);
      return rejectWithValue(err?.message || "Error in placing order");
    }
  }
);
