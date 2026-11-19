import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'paradise-nursery-cart-v1';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item) =>
        item &&
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        Number.isFinite(item.price) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      if (!product || state.items.some((item) => item.id === product.id)) return;
      state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
      });
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, change, quantity } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;
      const nextQuantity = Number.isInteger(quantity)
        ? quantity
        : item.quantity + (Number.isInteger(change) ? change : 0);
      if (nextQuantity <= 0) {
        state.items = state.items.filter((entry) => entry.id !== id);
      } else {
        item.quantity = Math.min(99, nextQuantity);
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export default cartSlice.reducer;
export { STORAGE_KEY };
