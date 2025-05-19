import { createSlice } from "@reduxjs/toolkit";
import { getAllCategories } from "../actions/categoriesActions";
const initialState = {
  isLoading: false,
  data: [],
  pagination: {},
  error: null,
};
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
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
      });
  },
});
export default categoriesSlice.reducer;
