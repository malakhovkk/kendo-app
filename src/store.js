import { configureStore } from "@reduxjs/toolkit";
import reducer from "./features/slice";

const store = configureStore({
  reducer: {
    info: reducer,
  },
});

export default store;