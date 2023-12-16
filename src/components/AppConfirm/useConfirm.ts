import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { hideConfirm, showConfirm } from './reducer';
import { AppConfirmConfig } from '.';
import { FormikValues } from 'formik';

let resolveCallback: (value: [isConfirm: boolean, values: FormikValues | undefined]) => void;
const useConfirm = () => {
  const dispatch = useAppDispatch();
  const confirmState = useAppSelector(state => state.confirm);

  const onConfirm = (values: FormikValues) => {
    dispatch(hideConfirm());
    resolveCallback([ true, values ]);
  };

  const onCancel = () => {
    dispatch(hideConfirm());
    resolveCallback([ false, undefined ]);
  };
  const confirm = (config: AppConfirmConfig) => {
    dispatch(showConfirm(config));
    return new Promise<[isConfirm: boolean, values: FormikValues | undefined]>(resolve => {
      resolveCallback = resolve;
    });
  };

  return { confirm, onConfirm, onCancel, confirmState };
};

export default useConfirm;