import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ICartState {
  cartItems: Item[];
}

const initialState: ICartState = {
  cartItems: [],
}

interface CartPayload {
  cartItems: Item[];
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartState: (state, action: PayloadAction<CartPayload>) => {
      state.cartItems = action.payload.cartItems;
    },
  },
});

export const { setCartState } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;