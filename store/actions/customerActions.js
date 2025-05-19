import { GET_CUSTOMER_DETAILS_API } from "@/constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
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
