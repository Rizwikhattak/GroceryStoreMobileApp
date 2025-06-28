import {
  CUSTOMER_DETAILS_API,
  GET_CUSTOMER_DETAILS_API,
  PANTRY_PRODUCTS_API,
  SETTINGS_API,
} from "@/constants/apis";
import { API_COMMON } from "@/utils/ApiCommon";
import { axiosJSON } from "@/utils/Axios";
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
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      // Add each filter parameter if it exists
      if (filters.status && filters.status !== "All") {
        queryParams.append("status", filters.status);
      }

      if (filters.from) {
        queryParams.append("from", filters.from);
      }

      if (filters.to) {
        queryParams.append("to", filters.to);
      }

      if (filters.order_id) {
        queryParams.append("order_id", filters.order_id);
      }

      if (filters.supplier) {
        queryParams.append("supplier", filters.supplier);
      }

      // Pagination and sorting
      queryParams.append("skip", filters.skip?.toString() || "0");
      queryParams.append("limit", filters.limit?.toString() || "10");
      queryParams.append("sort", filters.sort || "created_at");
      queryParams.append("order", filters.order?.toString() || "-1");

      // Build the final URL with query string
      const queryString = queryParams.toString();
      const url = queryString
        ? `${SETTINGS_API.ORDERS}?${queryString}`
        : SETTINGS_API.ORDERS;

      const response = await API_COMMON(
        "getAll",
        "json",
        url,
        "Error in fetching orders",
        null
      );
      return response;
    } catch (err) {
      return rejectWithValue(err?.message || "Error in fetching orders");
    }
  }
);
// export const printCustomerOrder = createAsyncThunk(
//   "settings/printCustomerOrder",
//   async (data, { rejectWithValue }) => {
//     try {
//       console.log(
//         "data",
//         data,
//         `${SETTINGS_API.DOWNLOAD_ORDER}${data.orderId}/${data.user}`
//       );
//       const response = await axiosJSON.get(
//         `${SETTINGS_API.DOWNLOAD_ORDER}${data.orderId}/${data.user}`,
//         {
//           responseType: "arraybuffer",
//         }
//       );
//       const base64 = Buffer.from(response.data, "binary").toString("base64");
//       return { base64 };

//       // const response = await API_COMMON(
//       //   "download",
//       //   "json",
//       //   `${SETTINGS_API.DOWNLOAD_ORDER}${data.orderId}/${data.user}`,
//       //   "Error in fetching products",
//       //   null
//       // );
//       // const base64 = Buffer.from(response, "binary").toString("base64");
//       // return { base64 };
//     } catch (err) {
//       return rejectWithValue(err?.message || "Error in fetching products");
//     }
//   }
// );
// settingsActions.ts  (already correct)
/* store/actions/orderActions.ts */
export const printCustomerOrder = createAsyncThunk(
  "settings/printCustomerOrder",
  async (p, { rejectWithValue }) => {
    try {
      const res = await API_COMMON(
        "download",
        "json",
        `${SETTINGS_API.DOWNLOAD_ORDER}${p.orderId}/${p.user}`,
        "Could not fetch PDF"
      ); // res is an ArrayBuffer

      const base64 = Buffer.from(res, "binary") // <- tiny poly-fill (see below)
        .toString("base64");

      return { base64 };
    } catch (err) {
      return rejectWithValue(err?.message ?? "Download failed");
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
