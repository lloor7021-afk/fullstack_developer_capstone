import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { STORAGE_KEY } from './CartSlice.jsx';

const store = configureStore({
  reducer: { cart: cartReducer },
});

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    // The cart remains usable when browser storage is unavailable.
  }
});

export default store;
