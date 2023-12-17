import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SearchRequest } from 'src/types/Request';
import Notification from 'src/types/Notification';

// Define a type for the slice state
export interface NotificationCenterState {
  open: boolean;
  filter: SearchRequest<{unreadOnly: boolean}>;
  data: Notification[];
}

export const defaultFilter: SearchRequest<{unreadOnly: boolean}> = {
  searchInput: '',
  filter: {
    unreadOnly: false
  },
  page: 0,
  limit: 10,
};

// Define the initial state using that type
const initialState: NotificationCenterState = {
  open: false,
  filter: defaultFilter,
  data: []
};

export const notificationCenterSlice = createSlice({
  name: 'notificationCenter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.open = payload;
    },
    setFilter: (state, { payload }: PayloadAction<SearchRequest<{unreadOnly: boolean}>>) => {
      state.filter = payload;
    },
    setData: (state, { payload }: PayloadAction<Notification[]>) => {
      state.data = payload;
    },
    prependData: (state, { payload }: PayloadAction<Notification>) => {
      // Prepend new notifiation to the top of data list
      const newData = state.data.slice();
      newData.unshift(payload);
      state.data = newData;
    },
  },
});

export const { setOpen, setData, setFilter, prependData } = notificationCenterSlice.actions;

export default notificationCenterSlice.reducer;