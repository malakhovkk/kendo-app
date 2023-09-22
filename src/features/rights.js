import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
// Чтобы не хардкодить урлы, делаем модуль, в котором они создаются
import { getUserUrl } from "./routes.js";

// Создаем Thunk
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById", // отображается в dev tools и должно быть уникально у каждого Thunk
  async (userId) => {
    // Здесь только логика запроса и возврата данных
    // Никакой обработки ошибок
    const response = await axios.get(
      `http://194.87.239.231:55555/api/rights/${localStorage.getItem("login")}`
    );
    return response.data;
  }
);

const usersAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: "users",
  // Добавляем в состояние отслеживание процесса загрузки
  // { ids: [], entities: {}, loadingStatus: 'idle', error: null }
  initialState: usersAdapter.getInitialState({
    loadingStatus: "idle",
    error: null,
  }),
  reducers: {
    // любые редьюсеры, которые нам нужны
  },
  extraReducers: (builder) => {
    builder
      // Вызывается прямо перед выполнением запроса
      .addCase(fetchUserById.pending, (state) => {
        state.loadingStatus = "loading";
        state.error = null;
      })
      // Вызывается в том случае если запрос успешно выполнился
      .addCase(fetchUserById.fulfilled, (state, action) => {
        // Добавляем пользователя
        usersAdapter.addOne(state, action);
        state.loadingStatus = "idle";
        state.error = null;
      })
      // Вызывается в случае ошибки
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingStatus = "failed";
        // https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors
        state.error = action.error;
      });
  },
});
