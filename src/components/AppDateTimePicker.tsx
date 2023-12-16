import { FormControl, InputLabel, Theme, useTheme } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FocusEventHandler, ReactNode, useEffect, useState } from 'react';
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_APM_FORMAT, SERVER_DATETIME_FORMAT } from 'src/constants/common';
import dayjs, { Dayjs } from 'dayjs';
import { Variant } from '@mui/material/styles/createTypography';
import AppViewTextField from './AppViewTextField';
import { omit } from 'lodash';
import AppRequiredAsterisk from './AppRequiredAsterisk';

export interface AppDateTimePickerProps {
  id: string;
  name: string;
  label: string;
  fullWidth?: boolean;
  value?: string; // YYYY-MM-DDTHH:mm:ss
  defaultValue: string; // YYYY-MM-DDTHH:mm:ss;
  setFieldValue: (field: string, value: unknown) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  error?: boolean;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'normal';
  showViewMode?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  showPeriodOnly?: boolean;
}

const sizeVariants = {
  normal: {
    typography: 'subtitle3' as Variant,
    borderRadius: 8,
    paddingY: 1.5,
  },
  small: {
    typography: 'body4' as Variant,
    borderRadius: 6,
    paddingY: 1,
  }
};

const useStyles = (theme: Theme, size: 'small' | 'normal') => ({
  root: {
    position: 'relative',
    borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
    paddingTop: theme.spacing(1),
    '& .MuiFormHelperText-root': {
      ...theme.typography[sizeVariants[size].typography],
      marginX: 0,
    },
  },
  label: {
    transform: `translateY(${theme.typography.pxToRem(-8)})`,
    color: theme.palette.text.secondary,
    ...theme.typography[sizeVariants[size].typography],
  },
  dateTimePicker: {
    '&.Mui-disabled:before': {
      borderBottomStyle: 'inset',
    },
    '& .MuiInputBase-root': {
      borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.background.dark,
    },
    marginTop: theme.spacing(1),
    border: 'none',
    '& .MuiInputBase-input': {
      borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
      position: 'relative',
      borderColor: theme.palette.background.gray,
      padding: `${theme.spacing(sizeVariants[size].paddingY)} ${theme.spacing(1.5)}`,
      backgroundColor: theme.palette.background.light,
      '&:focus': {
        backgroundColor: theme.palette.background.light,
        borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
      },
      ...theme.typography[sizeVariants[size].typography]
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.light,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      }
    },
    '&:before, &:hover:before, &:after, &:hover:after': {
      borderBottom: 'none !important',
    }
  }
});

const AppDateTimePicker = (props: AppDateTimePickerProps) => {
  const { size = 'normal', name, label, defaultValue, value, setFieldValue,
    disabled, showViewMode, id, error, required, showPeriodOnly, minDate, maxDate
  } = props;
  const valueFromString = (value?: string) => (value ? dayjs(value) : undefined);
  const theme = useTheme();
  const styles = useStyles(theme, size);
  const format = showPeriodOnly ? DEFAULT_DATE_APM_FORMAT : DEFAULT_DATETIME_FORMAT;

  const [ _defaultValue, setDefaultValue ] = useState(valueFromString(defaultValue));

  useEffect(() => {
    setDefaultValue(valueFromString(value) || valueFromString(defaultValue));
  }, [ value ]);

  if (showViewMode) {
    return (<AppViewTextField
      fullWidth
      id={id}
      label={label}
      size="small"
      value={_defaultValue?.format(format)}
    />);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <FormControl
        fullWidth
        variant="standard"
        error={error}
        sx={styles.root}
      >
        <InputLabel
          sx={styles.label}
        >
          {label}
          <AppRequiredAsterisk required={required} />
        </InputLabel>
        <DateTimePicker
          key={JSON.stringify(_defaultValue)}
          format={format}
          defaultValue={_defaultValue}
          value={valueFromString(value)}
          onChange={val => setFieldValue(name, (val as Dayjs)?.format(SERVER_DATETIME_FORMAT))}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: { ...omit(props, 'size', 'onChange', 'label', 'required', 'value', 'defaultValue') },
          }}
          sx={styles.dateTimePicker}
        />
      </FormControl>

    </LocalizationProvider>
  );
};

export default AppDateTimePicker;
