import { ReactNode, forwardRef } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AlertColor, Box } from '@mui/material';
import BaseAlert from './BaseAlert';
import { useAppDispatch } from 'src/store/hooks';
import { hideAlert } from '../reducer';

export interface GlobalAlertProps {
  children: ReactNode;
}
interface CustomGlobalAlertProps {
  id: string;
  variant: AlertColor;
  action: string;
  message?: string;
}
const CustomGlobalAlert = forwardRef((props: CustomGlobalAlertProps, ref) => {
  const dispatch = useAppDispatch();
  const { closeSnackbar } = useSnackbar();
  const { variant, action, message, id } = props;
  const [ alertId, type ] = id.split('.');
  return (<BaseAlert
    open={true}
    ref={ref}
    severity={variant}
    title={action}
    message={message}
    loading={type === 'loading'}
    handleClose={() => {
      closeSnackbar(id);
      dispatch(hideAlert(alertId));
    }}
  />);
});
CustomGlobalAlert.displayName = 'CustomGlobalAlert';

const GlobalAlert = (props: GlobalAlertProps) => {
  const { children } = props;
  return <Box sx={{ '& .snackbar-container': { mt: 7 } }}>
    <SnackbarProvider
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      maxSnack={5}
      classes={{
        containerRoot: 'snackbar-container',
      }}
      Components={{
        default: CustomGlobalAlert,
        success: CustomGlobalAlert,
        info: CustomGlobalAlert,
        error: CustomGlobalAlert,
        warning: CustomGlobalAlert
      }}
    >
      {children}
    </SnackbarProvider>
  </Box>;

};

export default GlobalAlert;