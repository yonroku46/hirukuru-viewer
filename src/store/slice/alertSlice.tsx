import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAlertState {
  open: boolean;
  contents: string;
  severity: 'error' | 'info' | 'success' | 'warning';
  href?: string;
}

const initialState: IAlertState = {
  open: false,
  contents: '',
  severity: 'info',
  href: undefined
}

interface AlertPayload {
  open: boolean;
  contents: string;
  severity: 'error' | 'info' | 'success' | 'warning';
  href?: string;
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlertState: (state, action: PayloadAction<AlertPayload>) => {
      state.open = action.payload.open;
      state.contents = action.payload.contents;
      state.severity = action.payload.severity;
      state.href = action.payload.href;
    },
  },
});

export const { setAlertState } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;