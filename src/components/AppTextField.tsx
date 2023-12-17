import { FormControl, InputLabel, TextField, TextFieldProps, IconButton, InputAdornment, useTheme, Theme, SxProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppCircularProgress } from './AppCircularProgress';
import React, { useEffect, useState } from 'react';
import { Variant } from '@mui/material/styles/createTypography';
import { AppViewTextField } from './AppViewTextField';
import { debounce, omit } from 'lodash';
import { DEFAULT_INPUT_DEBOUNCE } from 'src/constants/common';
import { AppRequiredAsterisk } from './AppRequiredAsterisk';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'size'> {
  loading?: boolean;
  label?: string;
  type?: string;
  size?: 'small' | 'normal';
  required?: boolean;
  showViewMode?: boolean;
  setFieldValue: (field: string, value: unknown) => void;
  name: string;
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

const useStyles = (theme: Theme, size: 'small' | 'normal', sx: SxProps<Theme>) => ({
  root: {
    mt: 2,
    '& .MuiInputBase-input': {
      borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
      position: 'relative',
      paddingX: theme.spacing(1.5),
      paddingY: sizeVariants[size].paddingY,
      backgroundColor: theme.palette.background.light,
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      ...theme.typography[sizeVariants[size].typography]
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
      backgroundColor: theme.palette.background.light,
      padding: '0 !important',
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
    },
    '& .MuiFormHelperText-root': {
      ...theme.typography[sizeVariants[size].typography],
      marginX: 0,
    },
    ...sx,
  },
  label: {
    transform: `translateY(${theme.typography.pxToRem(-24)})`,
    color: theme.palette.text.secondary,
    ...theme.typography[sizeVariants[size].typography],
  }
});

export const AppTextField = (props: AppTextFieldProps) => {
  const {
    id, loading, label, type = 'text', required = false, size = 'normal', sx = {}, showViewMode,
    error, setFieldValue, defaultValue, value, name, onChange
  } = props;
  const theme = useTheme();
  const styles = useStyles(theme, size, sx);
  const [ showPassword, setShowPassword ] = React.useState(false);
  const [ _defaultValue, setDefaultValue ] = useState(defaultValue);

  useEffect(() => {
    setDefaultValue(value || defaultValue);
  }, [ value ]);

  const isPasswordType = type === 'password';
  const togglePasswordVisibility = () => {
    if (isPasswordType) {
      setShowPassword(!showPassword);
    }
  };

  const inputType = showPassword ? 'text' : type;
  const sizeVariant = sizeVariants[size];
  const typography = theme.typography[sizeVariant.typography];

  if (showViewMode) {
    return (<AppViewTextField
      fullWidth
      id={id}
      label={label}
      size="small"
      value={_defaultValue as string}
    />);
  }

  return (
    <FormControl
      fullWidth
      error={error}
      variant="standard"
      sx={label != undefined ? styles.root :  { ...styles.root, mt: 0 }}
    >
      <InputLabel
        id={`${id}-label`}
        sx={styles.label}
      >
        {label}
        <AppRequiredAsterisk required={required} />
      </InputLabel>
      <TextField
        key={_defaultValue as string}
        {...omit(props, 'size', 'label', 'sx', 'required', 'onChange', 'value')}
        onChange={debounce(event => onChange ? onChange(event) :
          setFieldValue(name, event.target.value), DEFAULT_INPUT_DEBOUNCE)}
        type={inputType}
        defaultValue={_defaultValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ position: 'absolute', top: '50%', right: theme.spacing(3) }}>
              {isPasswordType && (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  sx={{
                    width: theme.typography.pxToRem(24),
                    height: theme.typography.pxToRem(24),
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              {loading && (
                <AppCircularProgress size={typography.fontSize} sx={{ mr: 1 }} />
              )}
            </InputAdornment>
          ),
          ...props.InputProps,
        }}
      />
    </FormControl>
  );
};
