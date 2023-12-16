import { Alert, AlertColor, AlertTitle, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppCircularProgress from 'src/components/AppCircularProgress';
import { MouseEventHandler, ReactNode, forwardRef } from 'react';

export interface BaseAlertProps {
  open: boolean;
  handleClose: MouseEventHandler<HTMLButtonElement> | undefined;
  severity: AlertColor;
  mb?: number;
  loading?: boolean;
  title?: string;
  message?: ReactNode;
}
const BaseAlert = forwardRef((props: BaseAlertProps, ref) => {
  const { loading, mb, severity, open, handleClose, title, message } = props;
  return (<Collapse in={open} ref={ref}>
    <Alert
      action={!loading ?
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton> : undefined
      }
      icon={loading ? <AppCircularProgress size="1.2rem" sx={{ mt: 0.5 }} /> : undefined}
      sx={{ mb }}
      severity={severity as AlertColor}
    >
      {title && <AlertTitle sx={{ m: 0 }}>{title}</AlertTitle>}
      {message}
    </Alert>
  </Collapse>);
});

BaseAlert.displayName = 'BaseAlert';
export default BaseAlert;