import { configureStore } from "@reduxjs/toolkit";
import priceListSlice from "../../rtk/PriceList/priceListSlice";

export const store = configureStore({
  reducer: {
    app: priceListSlice,
  },
});
