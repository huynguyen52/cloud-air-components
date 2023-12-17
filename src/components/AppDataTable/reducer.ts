import { createSlice } from '@reduxjs/toolkit';
import { NEW_ROW_ID } from '.';
import { SearchRequest } from 'src/types/Request';

// Define a type for the slice state
export interface TableState {
  filters: {[key: string]: SearchRequest};
  addingRow: {[key: string]: unknown};
  editingChanges: {[key: string]: {[key: number | string]: unknown}};
  editingErrors: {[key: string]: {[key: number | string]: { [key: string | number]: string | undefined }}};
  expandingRows: {[key: string]: Array<number | string>};
  selectingRows: {[key: string]: Array<unknown>};
}

// Define the initial state using that type
const initialState: TableState = {
  filters: {},
  addingRow: {},
  editingChanges: {},
  editingErrors: {},
  expandingRows: {},
  selectingRows: {}
};

export const tableSlice = createSlice({
  name: 'table',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFilters: (state, { payload: { id, filter } }) => {
      state.filters[id] = filter;
    },
    clearFilters: (state, { payload: id }) => {
      delete state.filters[id];
    },
    setAddingRow: (state, { payload: { id, row } }) => {
      state.addingRow[id] = row;
    },
    clearAddingRow: (state, { payload: id }) => {
      delete state.addingRow[id];
    },
    setEditingChanges: (state, { payload: { id, changes } }) => {
      state.editingChanges[id] = changes;
    },
    clearEditingChanges: (state, { payload: id }) => {
      delete state.editingChanges[id];
    },
    setEditingError: (state, { payload: { id, rowId, error } }) => {
      if (!state.editingErrors[id]) {
        state.editingErrors[id] = {};
      }
      state.editingErrors[id][rowId] = error;
    },
    setEditingErrors: (state, { payload: { id, errors } }) => {
      if (!state.editingErrors[id]) {
        state.editingErrors[id] = {};
      }
      state.editingErrors[id] = { ...state.editingErrors[id], ...errors };
    },
    clearEditingError: (state, { payload: { id, rowId } }) => {
      if (state.editingErrors[id]) {
        delete state.editingErrors[id][rowId];
      }
    },
    clearEditingErrors: (state, { payload: id }) => {
      delete state.editingErrors[id];
    },
    clearEditingErrorsExcludeNewRow: (state, { payload: id }) => {
      if (state.editingErrors[id]) {
        Object.keys(state.editingErrors[id]).forEach((rowId: number | string) => {
          if (rowId !== NEW_ROW_ID) {
            delete state.editingErrors[id][rowId];
          }
        });
      }
    },
    setExpandingRows: (state, { payload: { id, rowIds } }) => {
      state.expandingRows[id] = rowIds;
    },
    clearExpandingRows: (state, { payload: id }) => {
      delete state.expandingRows[id];
    },
    setSelectingRows: (state, { payload: { id, rows } }) => {
      state.selectingRows[id] = rows;
    },
    clearSelectingRows: (state, { payload: id }) => {
      delete state.selectingRows[id];
    },
    reset: (state, { payload: id }) => {
      delete state.filters[id];
      delete state.addingRow[id];
      delete state.editingChanges[id];
      delete state.editingErrors[id];
      delete state.expandingRows[id];
      delete state.selectingRows[id];
    }
  },
});

export const { setFilters, clearFilters, setAddingRow, clearAddingRow,
  setEditingChanges, clearEditingChanges,
  setEditingError, clearEditingError, clearEditingErrors,
  setEditingErrors, clearEditingErrorsExcludeNewRow,
  setExpandingRows, clearExpandingRows, reset,
  setSelectingRows, clearSelectingRows
} = tableSlice.actions;

export default tableSlice.reducer;