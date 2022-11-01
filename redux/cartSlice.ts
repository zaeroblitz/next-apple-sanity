import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface CartItemProps {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItemProps[];
}

const initialState: CartProps = {
  items: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const exist = state.items.find(
        (item) => item.product._id === action.payload._id
      );

      if (exist) {
        exist.quantity += 1;
      } else {
        const newItem = {
          product: action.payload,
          quantity: 1,
        };
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload.id
      );
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, current) => total + current.product.price * current.quantity,
    0
  );
export default cartSlice.reducer;
