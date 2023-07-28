import { createSlice } from "@reduxjs/toolkit";
import data from "../pages/Users/Users.json";
const initialState = {
    users: data.user_group
};
console.log(initialState);
const slice = createSlice({
  name: "user_group",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    editUser: (state, action) => {
        const arr = state.users.map(el =>{
            if(el.id != action.payload.id) return el;
            else return action.payload.formData;
        });
        state.users = arr;
    }
  },
});

export const { addUser, removeUser, editUser } = slice.actions;

export default slice.reducer;