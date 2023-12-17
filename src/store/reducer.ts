import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserDetails } from 'src/types/User';

// Define a type for the slice state
export interface GlobalState {
  user?: UserDetails;
  sideBarOpen: boolean;
  sideBarHover: boolean;
  sideBarCollapse: { [key: string]: boolean };
}

// Define the initial state using that type
const initialState: GlobalState = {
  sideBarOpen: false,
  sideBarHover: false,
  sideBarCollapse: {}
};

export const globalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.user = action.payload;
    },
    clearUserDetails: state => {
      state.user = undefined;
    },
    showSideBar: state => {
      state.sideBarOpen = true;
    },
    hideSideBar: state => {
      state.sideBarOpen = false;
    },
    hoverSideBar: state => {
      if (!state.sideBarOpen && !state.sideBarHover) {
        state.sideBarHover = true;
      }
    },
    hoverLeaveSideBar: state => {
      if (!state.sideBarOpen || state.sideBarHover) {
        state.sideBarHover = false;
      }
    },
    setSideBarCollapse: (state, { payload: { code, isOpen } }) => {
      state.sideBarCollapse[code] = isOpen;
    },
    setSideBarCollapses: (state, { payload: { codes, isOpen } }) => {
      codes.forEach((code: string) => {
        state.sideBarCollapse[code] = isOpen;
      });
    }
  },
});

export const {
  setUserDetails,
  showSideBar,
  hideSideBar,
  setSideBarCollapse,
  setSideBarCollapses,
  hoverSideBar,
  hoverLeaveSideBar,
  clearUserDetails
} = globalSlice.actions;

export default globalSlice.reducer;