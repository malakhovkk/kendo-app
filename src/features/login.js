import { createSlice } from "@reduxjs/toolkit";
import { logonUser } from "./actions";

const initialState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  errorMessage: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    delete: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [logonUser.pending]: (state) => {
      state.isLoading = true;
    },
    [logonUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = payload;
    },
    [logonUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      alert("Произошла ошибка! ");
      state.errorMessage = payload;
    },
  },
});

export default loginSlice.reducer;
