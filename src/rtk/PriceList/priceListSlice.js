import { createSlice } from '@reduxjs/toolkit'
import { priceListApi } from './priceListApi'


const fetchTable = createAsyncThunk(
    'priceList/fetchTable',
    async (id, thunkAPI) => {
      const response = await priceListApi.fetchById(id)
      return response.data
    }
  )


const initialState = { value: 0 }

const priceListSlice = createSlice({
  name: 'priceList',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchTable.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload)
    })
  },
  
})

// export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer