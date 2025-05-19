import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  getSubCategories,
} from "../actions/categoriesActions";
const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
  selectedCategory: {},
  SubCategories: {
    isLoading: false,
    data: [],
    pagination: {},
    error: null,
  },
};
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.data = data;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getSubCategories.pending, (state, action) => {
        state.SubCategories.isLoading = true;
        state.SubCategories.error = null;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        const data = action.payload.list;
        state.SubCategories.data = data;
        state.SubCategories.pagination = action.payload.pagination;
        state.SubCategories.isLoading = false;
        state.SubCategories.error = null;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.SubCategories.isLoading = false;
        state.SubCategories.error = action.payload;
      });
  },
});
export const {
  setSelectedCategory,
  clearSelectedCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
