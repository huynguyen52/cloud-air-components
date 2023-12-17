import React from 'react';
import { Box, InputLabel, TextFieldProps, Typography, useTheme } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';


export interface AppViewTextFieldProps extends Omit<TextFieldProps, 'size'> {
  value?: string;
  label?: string;
  size?: 'small' | 'normal';
}

const sizeVariants = {
  small: {
    typography: 'body4' as Variant,
    borderRadius: 6,
    paddingY: 1,
  },
  normal: {
    typography: 'subtitle3' as Variant,
    borderRadius: 8,
    paddingY: 1.5,
  }
};

export const AppViewTextField: React.FC<AppViewTextFieldProps> = ({ size = 'normal', value, label }) => {

  const theme = useTheme();
  const sizeVariant = sizeVariants[size];
  const typography = theme.typography[sizeVariant.typography];

  return (
    <Box sx={{
      borderBottom: '1px solid',
      borderColor: theme.palette.background.gray,
    }}>
      <InputLabel
        sx={{
          transform: `translateY(${theme.typography.pxToRem(-6)})`,
          color: theme.palette.text.secondary,
          ...typography,
        }}
      >{label}</InputLabel>
      <Box sx={{
        paddingY: 1.25, paddingX: 1.5, minHeight: theme.typography.pxToRem(44)
      }}>
        <Typography variant="body4">
          {value}
        </Typography>
      </Box>
    </Box>

  );
};
