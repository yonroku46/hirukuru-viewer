import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  hasLogin: boolean;
}

const initialState: IAuthState = {
  hasLogin: false,
}

interface AuthPayload {
  hasLogin: boolean;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthPayload>) => {
      state.hasLogin = action.payload.hasLogin;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;