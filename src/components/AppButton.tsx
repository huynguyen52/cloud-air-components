import { Button, ButtonProps, Typography, useTheme } from '@mui/material';
import { AppCircularProgress } from './AppCircularProgress';
import { Variant } from '@mui/material/styles/createTypography';

export interface AppButtonProps extends Omit<ButtonProps, 'size'> {
  loading?: boolean;
  size?: 'small' | 'normal';
}

const sizeVariants = {
  small: {
    typography: 'buttonSmall' as Variant,
    paddingY: 0.75,
  },
  normal: {
    typography: 'button' as Variant,
    paddingY: 1,
  }
};

export const AppButton = (props: AppButtonProps) => {
  const theme = useTheme();
  const { size = 'normal', loading, disabled, children, sx = {}, ...rest } = props;
  const sizeVariant = sizeVariants[size];
  return (<Button {...rest}
    disabled={disabled || loading}
    sx={{
      borderRadius: theme.typography.pxToRem(6),
      px: theme.spacing(1.75),
      py: sizeVariant.paddingY,
      ...sx
    }}
  >
    {loading && <AppCircularProgress size={theme.typography[sizeVariant.typography].fontSize} sx={{ mr: 1 }} />}
    <Typography
      variant={sizeVariant.typography}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
    >
      {children}
    </Typography>
  </Button>);
};
