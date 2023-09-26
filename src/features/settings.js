import { createSlice } from "@reduxjs/toolkit";

// Начальное значение
const initialState = {
  value: [],
  rights: [],
  login: "",
};

const settings = createSlice({
  name: "counter",
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    addToRights: (state, action) => {
      state.rights = action.payload;
    },
    freeze: (state, action) => {
      state.frozen = action.payload;
    },
    logon: (state, action) => {
      state.login = action.payload;
    },
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Пример с данными
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { addToRights, freeze, logon } = settings.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default settings.reducer;
