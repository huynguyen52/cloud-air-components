import { Checkbox, FormControlLabel, SwitchProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';

export interface AppCheckboxProps extends Omit<SwitchProps, 'defaultValue' | 'id'> {
  id: string | number;
  name: string;
  label: ReactNode;
  defaultValue: boolean;
  fullWidth?: boolean;
}

const AppCheckbox = (props: AppCheckboxProps) => {
  const { id, label, defaultValue, fullWidth, ...rest } = props;
  const theme = useTheme();
  const width = fullWidth ? '100%' : undefined;
  const fontSize = props.size === 'small' ? theme.typography.pxToRem(14) : theme.typography.pxToRem(16);
  return (<FormControlLabel
    sx={{ '& .MuiFormControlLabel-label': { width, fontSize }, width }}
    control={<Checkbox
      {...rest}
      id={id?.toString()}
      defaultChecked={defaultValue}
    />}
    label={label}
  />);
};

export default AppCheckbox;