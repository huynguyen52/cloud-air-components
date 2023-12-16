import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DEFAULT_DATE_FORMAT, SERVER_DATE_FORMAT } from 'src/constants/common';
import dayjs from 'dayjs';
import { FocusEventHandler, ReactNode } from 'react';
import theme from 'src/themes/default';

export interface AppDatePickerProps {
  id: string;
  name: string;
  label: string;
  fullWidth?: boolean;
  value?: string; // YYYY-MM-DD
  defaultValue: string; // YYYY-MM-DD;
  onChange: (field: string, value: unknown) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: boolean;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
}


const AppDatePicker = (props: AppDatePickerProps) => {
  const { name, label, defaultValue, value, onChange, disabled, ...rest } = props;

  const valueFromString = (value?: string) => value ? dayjs(value): undefined;

  return (<LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={label}
      format={DEFAULT_DATE_FORMAT}
      value={valueFromString(value)}
      defaultValue={valueFromString(defaultValue)}
      onChange={val => onChange(name, val?.format(SERVER_DATE_FORMAT))}
      disabled={disabled}
      slotProps={{
        textField: { ...rest },
      }}
      sx={{
        '& .MuiInputLabel-root': {
          marginBottom: theme.spacing(1),
          transform: `translateY(${theme.typography.pxToRem(-24)})`,
          color: theme.palette.text.primary,
          ...theme.typography.subtitle3,
        },
        '& .MuiInputBase-input': {
          padding: theme.spacing(1.5),
        },
      }}
    />
  </LocalizationProvider>);
};

export default AppDatePicker;
