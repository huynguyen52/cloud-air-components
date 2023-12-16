import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';
import { AppConfirmConfig } from '.';
import { ReactNode } from 'react';
import { AppFormikProps } from 'src/utils/formikUtils';

// Define a type for the slice state
interface ConfirmState {
  title: string;
  message?: ReactNode;
  initialValues?: FormikValues;
  form?: (props: AppFormikProps) => JSX.Element;
  open: boolean;
  validationSchema?: unknown;
  swapActions?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

// Define the initial state using that type
const initialState: ConfirmState = {
  title: '',
  open: false,
};

export const confirmSlice = createSlice({
  name: 'confirm',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showConfirm: (state, { payload }: PayloadAction<AppConfirmConfig>) => {
      state.open = true;
      state.title = payload.title;
      state.form = payload.form;
      state.initialValues = payload.initialValues;
      state.message = payload.message;
      state.validationSchema = payload.validationSchema;
      state.swapActions = payload.swapActions;
      state.confirmLabel = payload.confirmLabel;
      state.cancelLabel = payload.cancelLabel;
    },
    hideConfirm: () => initialState
  },
});

export const { showConfirm, hideConfirm } = confirmSlice.actions;

export default confirmSlice.reducer;