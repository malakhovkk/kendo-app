import { createSlice } from "@reduxjs/toolkit";

// Начальное значение
const initialState = {
  value: [],
};

const settings = createSlice({
  name: "counter",
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    addToRights: (state, action) => {
      state.value.push(...action.payload);
    },
    freeze: (state, action) => {
      state.frozen = action.payload;
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
export const { addToRights, freeze } = settings.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default settings.reducer;
