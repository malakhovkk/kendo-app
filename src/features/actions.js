import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const logonUser = createAsyncThunk(
  "user/login",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `http://194.87.239.231:55555/api/logon`,
        body
      );
      //   axios.post(`http://194.87.239.231:55555/api/`, data, {
      //     headers: {
      //       'Authorization': `Basic ${local}`
      //     },
      //   })

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
