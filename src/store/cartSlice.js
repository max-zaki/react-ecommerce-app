import { createSlice } from '@reduxjs/toolkit';

const loadFromSessionStorage = () => {
  try {
    const data = sessionStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToSessionStorage = (items) => {
  sessionStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadFromSessionStorage(),
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }
      saveToSessionStorage(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveToSessionStorage(state.items);
    },
    updateQuantity(state, action) {
      const { id, count } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.count = count;
        if (item.count <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
      saveToSessionStorage(state.items);
    },
    clearCart(state) {
      state.items = [];
      sessionStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
