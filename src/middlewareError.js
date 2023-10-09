import { isRejectedWithValue } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react";
import { jwtExpired } from "./features/settings";
import { toast } from "react-toastify";
// import { toast } from 'your-cool-library'

/**
 * Log a warning and show a toast!
 */

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!

  if (isRejectedWithValue(action)) {
    console.warn("We got a rejected action!");
    // console.log(api);

    console.log(action.error);
    if (action.error)
      toast.error(`Ошибка `, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    if (action.payload.status === 401) api.dispatch(jwtExpired(true));
    // toast.warn({ title: 'Async error!', message: action.error.data.message })
  }

  return next(action);
};
