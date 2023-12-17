import { Typography, useTheme } from '@mui/material';

export const AppRequiredAsterisk = (props: {required?: boolean}) => {
  const { required } = props;
  const theme = useTheme();
  return required && (
    <span>
      {' '}(
      <Typography
        component="span"
        style={{ color: theme.palette.error.main, display: 'inline-block' }}
      >
        *
      </Typography>)
    </span>
  );
};
