import { useTranslation } from 'react-i18next';
import AppButton from '../AppButton';
import AppDialog from '../AppDialog';
import { FormikValues } from 'formik';
import * as yup from 'yup';
import useConfirm from './useConfirm';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react';
import { AppFormikProps } from 'src/utils/formikUtils';

export interface AppConfirmConfig {
  title: string;
  message?: ReactNode;
  initialValues?: FormikValues;
  form?: (props: AppFormikProps) => JSX.Element;
  validationSchema?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
  swapActions?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

const AppConfirm = () => {
  const { onConfirm, onCancel, confirmState } = useConfirm();
  const { t } = useTranslation();
  const confirmElement = document.getElementById('confirm');

  if (confirmElement) {
    const actions = [
      <AppButton key={0} onClick={onCancel} autoFocus>{confirmState.cancelLabel || t('common.cancel')}</AppButton>,
      <AppButton key={1} type="submit">
        {confirmState.confirmLabel || t('common.confirm')}
      </AppButton>
    ];
    const confirmPopup = <AppDialog
      key={JSON.stringify(confirmState.initialValues)}
      open={confirmState.open}
      title={confirmState.title}
      message={confirmState.message}
      form={confirmState.form}
      initialValues={confirmState.initialValues}
      validationSchema={confirmState.validationSchema as yup.ObjectSchema<yup.Maybe<yup.AnyObject>>}
      actions={confirmState.swapActions ? actions.reverse() : actions}
      handleSubmit={onConfirm}
    />;
    return createPortal(confirmPopup, confirmElement);
  }
};

export default AppConfirm;

export { useConfirm };