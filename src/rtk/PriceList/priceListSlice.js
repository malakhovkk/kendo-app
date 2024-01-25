// import { createSlice } from '@reduxjs/toolkit'
// import { priceListApi } from './priceListApi'

// const fetchTable = createAsyncThunk(
//     'priceList/fetchTable',
//     async (id, thunkAPI) => {
//       const response = await priceListApi.fetchById(id)
//       return response.data
//     }
//   )

// const initialState = { value: 0 }

// const priceListSlice = createSlice({
//   name: 'priceList',
//   initialState,
//   reducers: {

//   },
//   extraReducers: (builder) => {
//     // Add reducers for additional action types here, and handle loading state as needed
//     builder.addCase(fetchTable.fulfilled, (state, action) => {
//       // Add user to the state array
//       state.entities.push(action.payload)
//     })
//   },

// })

// // export const { increment, decrement, incrementByAmount } = counterSlice.actions
// export default counterSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//create action
export const fetchTable = createAsyncThunk(
  "fetchTable",
  async (id, { rejectWithValue }) => {
    // console.log("data", data);
    // let id = data.id;
    try {
      let res = await fetch(`http://194.87.239.231:55555/Document/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      });
      let dl = [];

      res[0].fieldsList.columns.forEach((element) => {
        dl[element.index] = {
          name: element.name,
          caption: element.caption,
          alignment: element.alignment,
          format: element.format,
        };
      });

      let data = JSON.parse(JSON.stringify(res)).map((_el) => {
        return {
          "1C": _el.linkId ? "+" : "-",
          priceDelta:
            _el.statistics.price === 0
              ? ""
              : (_el.statistics.price > 0 ? "+" : "-") + _el.statistics.price,
          quantDelta:
            _el.statistics.quant === 0
              ? ""
              : (_el.statistics.quant > 0 ? "+" : "-") + _el.statistics.quant,
          linkId: _el.linkId,
          priceDelta: _el.statistics.price,
          quantDelta: _el.statistics.quant,
          name: _el.name,
          sku: _el.sku,
          linkId: _el.linkId,
          price: _el.price,
          quant: _el.quant,
          quantStock: _el.quantStock,
          id: _el.id,
          ..._el.meta,
          status: "new",
        };
      });

      return { table: res, columns: data };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);



export const priceListSlice = createSlice({
  name: "priceList",
  initialState: {
    loadingTable: false,
    table: [],
    errorTable: "",
    searchData: [],
  },

  reducers: {
    // searchUser: (state, action) => {
    //   console.log(action.payload);
    //   state.searchData = action.payload;
    // },
  },
  extraReducers: {
    [fetchTable.pending]: (state) => {
      state.loadingTable = true;
    },
    [fetchTable.rejected]: (state, action) => {
      state.errorTable = action.message;
    },
    [fetchTable.fulfilled]: (state, action) => {
      state.loadingTable = false;
      state.table = action.payload.table;
      state.columns = action.payload.columns;
    },
  },
});

export default priceListSlice.reducer;

//export const { searchUser } = userDetail.actions;
