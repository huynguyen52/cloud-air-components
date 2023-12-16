import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { DEFAULT_ALERT_AUTOHIDE_DURATION } from 'src/constants/common';
import { AlertType } from 'src/constants/enums';

export type AlertId = string | number;
export type I18nextKey = string;

export type AlertState = {
  id: AlertId;
  type: AlertType;
  title?: string; // will be used to fill the title schema or the old title at {{title}}
  titleSchema?: I18nextKey; // i18next key the group of title with AlertType
  message?: ReactNode;
  duration?: number;
  static?: boolean;
  timeoutId?: NodeJS.Timeout;
}

export type AlertConfig = {
  title?: string;
  titleSchema?: I18nextKey;
}

// Define a type for the slice state
interface AlertPoolState {
  pool: {[key: AlertId]: AlertState}; // Map of alert ids to alert configurations
}

// Define the initial state using that type
const initialState: AlertPoolState = {
  pool: {}
};

const showAutohideAlert = createAsyncThunk(
  'alert/autoHideAlert',
  async (alertState: AlertState, { dispatch }) => {
    const duration = alertState.duration || DEFAULT_ALERT_AUTOHIDE_DURATION;
    const timeoutId = setTimeout(() => {
      dispatch(hideAlert(alertState.id));
    }, duration);
    dispatch(alertSlice.actions.showAlert({
      ...alertState,
      timeoutId,
      duration
    }));
  }
);

export const alertSlice = createSlice({
  name: 'alert',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showAlert: (state, { payload }: PayloadAction<AlertState>) => {
      if (state.pool[payload.id]) {
        clearTimeout(state.pool[payload.id].timeoutId);
      }
      state.pool[payload.id] = payload;
    },
    hideAlert: (state, { payload }: PayloadAction<AlertId>) => {
      delete state.pool[payload];
    }
  }
});

export const { hideAlert, showAlert } = alertSlice.actions;
export {
  showAutohideAlert
};

export default alertSlice.reducer;