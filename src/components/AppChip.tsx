import {
  useTheme,
  ChipProps,
  Chip,
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ForwardedRef, forwardRef } from 'react';

export interface AppChipProps extends Omit<ChipProps, 'color' | 'size'> {
  label: string;
  color?: string;
  bgcolor?: string;
  size?: 'small' | 'normal';
}

const sizeVariants = {
  small: {
    typography: 'body6' as Variant,
    borderRadius: 16,
    paddingY: 0.25,
    paddingX: 1,
  },
  normal: {
    typography: 'body4' as Variant,
    borderRadius: 32,
    paddingY: 0.5,
    paddingX: 1.5,
  }
};

const AppChip = forwardRef(({ size = 'normal', color, bgcolor, sx={}, ...props }: AppChipProps, ref: ForwardedRef<HTMLDivElement | null>) => {
  const theme = useTheme();
  const sizeVariant = sizeVariants[size];
  return (<Chip
    ref={ref}
    sx={{
      borderRadius: theme.typography.pxToRem(sizeVariant.borderRadius),
      paddingX: sizeVariant.paddingX,
      paddingY: sizeVariant.paddingY,
      bgcolor,
      color,
      ...theme.typography[sizeVariant.typography],
      height: '100%',
      span: {
        padding: 0
      },
      ...sx
    }}
    {...props}
  />);
});

AppChip.displayName = 'AppChip';

export default AppChip;