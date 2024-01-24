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
export const createUser = createAsyncThunk(
  "fetchTable",
  async (data, { rejectWithValue }) => {
    console.log("data", data);
    let id = data.id;
    try {
      let res = await fetch(`https://194.87.239.231:55555/Document/${id}`, {
        method: "POST",
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
      console.log(dl.filter((el) => el !== undefined));

      data = JSON.parse(JSON.stringify(res)).map((_el) => {
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

// //read action
// export const showUser = createAsyncThunk(
//   "showUser",
//   async (args, { rejectWithValue }) => {
//     const response = await fetch(
//       "https://641dd63d945125fff3d75742.mockapi.io/crud"
//     );

//     try {
//       const result = await response.json();
//       console.log(result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );
// //delete action
// export const deleteUser = createAsyncThunk(
//   "deleteUser",
//   async (id, { rejectWithValue }) => {
//     const response = await fetch(
//       `https://641dd63d945125fff3d75742.mockapi.io/crud/${id}`,
//       { method: "DELETE" }
//     );

//     try {
//       const result = await response.json();
//       console.log(result);
//       return result;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// //update action
// export const updateUser = createAsyncThunk(
//   "updateUser",
//   async (data, { rejectWithValue }) => {
//     console.log("updated data", data);
//     const response = await fetch(
//       `https://641dd63d945125fff3d75742.mockapi.io/crud/${data.id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     try {
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

export const userDetail = createSlice({
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

export default priceList.reducer;

//export const { searchUser } = userDetail.actions;
