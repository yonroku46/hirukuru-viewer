import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ICartState {
  cartItems: Food[];
}

const initialState: ICartState = {
  cartItems: [],
}

interface CartPayload {
  cartItems: Food[];
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