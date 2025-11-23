// src/redux/slices/favouritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFav(state, action) {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFav(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    setFavs(state, action) {
      state.items = action.payload || [];
    }
  }
});

export const { addFav, removeFav, setFavs } = favouritesSlice.actions;
export default favouritesSlice.reducer;
