// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import reducer from "./features/slice";
// import reducer_user_group from "./features/reducer_user_group";
// import reducer_rights from "./features/reducer_rights";
// const store = configureStore({
//   reducer: {
//     info: reducer,
//     user_group: reducer_user_group,
//     rights: reducer_rights
//   },
// });

// // const store = combineReducers({
// //       info: reducer,
// //       user_group: reducer_user_group,
// //       rights: reducer_rights
// //   });

// export default store;


// import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './features/main_slice';

// const reducer = {
//   users: userReducer
// }

// const store = configureStore({
//   reducer,
//   devTools: true,
// })

// export default store;
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/apiSlice";

export const store = configureStore({
  reducer: {
   [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
   getDefaultMiddleware().concat(userApi.middleware),
});

