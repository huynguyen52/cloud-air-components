import { Box } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormikHelpers, FormikValues } from 'formik';
import { isFunction, noop } from 'lodash';
import { ReactNode, useEffect } from 'react';
import { AppFormikProps, prepareFormikProps, useAppFormik } from 'src/utils/formikUtils';
import * as yup from 'yup';
import { AppCircularProgress } from './AppCircularProgress';
import { DEFAULT_DIALOG_CONTENT_MAX_HEIGHT } from 'src/constants/common';

export interface AppDialogProps extends Omit<DialogProps, 'title'>  {
  key: string;
  title: ReactNode;
  message?: ReactNode;
  form?: (props: AppFormikProps) => JSX.Element;
  actions?: (JSX.Element | false)[] | ((props: AppFormikProps) => (JSX.Element | false)[]);
  initialValues?: FormikValues;
  validationSchema?: yup.ObjectSchema<yup.Maybe<yup.AnyObject>>;
  handleSubmit?: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void;
  isLoading?: boolean;
  showViewMode?: boolean;
}

export const AppDialog = (props: AppDialogProps) => {
  const { actions, message, form: Form, handleSubmit = noop, initialValues = {},
    validationSchema, open, isLoading
  } = props;
  const { title, ...rest } = props;
  const formik = useAppFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    formik.resetForm(initialValues);
  }, [ open ]);

  useEffect(() => {
    if (formik.submitCount >= 1) {
      const fields = Object.keys(validationSchema?.fields || {});
      fields.forEach(field => {
        formik.setFieldTouched(field, true, true);
      });
    }
  }, [ formik.submitCount ]);

  const formProps = prepareFormikProps(formik, initialValues);

  return (
    <Dialog {...rest}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {isLoading && <Box position="absolute" left="calc(50% - 20px)" top="calc(50% - 20px)" zIndex={100}>
          <AppCircularProgress />
        </Box>}
        <DialogContent sx={{
          py: 0.1,
          maxHeight: DEFAULT_DIALOG_CONTENT_MAX_HEIGHT,
          overflow: 'hidden',
          overflowY: 'auto'
        }}>
          <Box visibility={isLoading ? 'hidden' : 'visible'}>
            {message && <DialogContentText>
              {message}
            </DialogContentText>}
            {Form && <Form key={JSON.stringify(initialValues)} {...formProps} />}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {isFunction(actions) ? actions(formProps) : actions}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
