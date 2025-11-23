// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setUserFromStorage(state, action) {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
    }
  }
});

export const { loginSuccess, logout, setUserFromStorage, updateUser } = authSlice.actions;
export default authSlice.reducer;
