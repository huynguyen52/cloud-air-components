import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps, Theme, useTheme } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INFINITE_PAGE_SIZE } from 'src/constants/common';
import OptionsHook, { LazyOptionsHook, OptionsDependencies } from 'src/types/OptionsHook';
import { SearchRequest } from 'src/types/Request';
import useOptionsSearch from 'src/utils/hooks/useOptionsSearch';
import { get, omit } from 'lodash';
import { Variant } from '@mui/material/styles/createTypography';
import AppViewTextField from './AppViewTextField';
import AppRequiredAsterisk from './AppRequiredAsterisk';

export interface AppSelectProps<T> extends Omit<SelectProps, 'size' | 'value' | 'onChange' | 'defaultValue'> {
  defaultValue: T;
  options?: OptionsHook<T> | T[];
  lazyOptions?: LazyOptionsHook<T>;
  optionsDependencies?: OptionsDependencies;
  defaultFilter?: { [key: string]: unknown };
  id: string;
  label?: string;
  name: string;
  setFieldValue: (field: string, value: unknown) => void;
  optionId: string;
  optionLabel?: string;
  renderOptionLabel?: (option: T) => ReactNode;
  allowNotChosen?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  size?: 'small' | 'normal';
  showViewMode?: boolean;
  value?: T;
  transformOnSubmit?: (value: T) => unknown;
}

const baseDefaultFilter: SearchRequest = {
  searchInput: '',
  page: 0,
  limit: INFINITE_PAGE_SIZE,
};

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
    '& .MuiFormHelperText-root': {
      ...theme.typography[sizeVariants[size].typography],
    }
  },
  label: {
    transform: `translateY(${theme.typography.pxToRem(-sizeVariants[size].borderRadius)})`,
    color: theme.palette.text.secondary,
    ...theme.typography[sizeVariants[size].typography],
  },
  select: {
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
      border: '1px solid',
      position: 'relative',
      boxSizing: 'border-box',
      borderColor: theme.palette.text.disabled,
      padding: `${theme.spacing(sizeVariants[size].paddingY)} ${theme.spacing(1.5)}`,
      backgroundColor: theme.palette.background.light,
      '&:focus': {
        borderColor: theme.palette.primary.main,
        outline: `0.5px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.background.light,
        borderRadius: theme.typography.pxToRem(sizeVariants[size].borderRadius),
      },
      '&:hover': {
        borderColor: theme.palette.primary.main
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main
      },
      ...theme.typography[sizeVariants[size].typography]
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.light,
      padding: '0 !important',
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
    },
    '&:before, &:hover:before, &:after, &:hover:after': {
      borderBottom: 'none !important',
    }
  }
});

const AppSelect = <T,>(props: AppSelectProps<T>) => {
  const {
    options, label, size = 'normal', error, id, allowNotChosen, setFieldValue, optionId, optionLabel = 'name', renderOptionLabel,
    helperText, optionsDependencies, lazyOptions, defaultFilter, name, required = false, showViewMode, defaultValue, value,
    transformOnSubmit
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useStyles(theme, size);
  const [ _defaultValue, setDefaultValue ] =  useState(get(defaultValue, optionId));

  const { allOptions } = useOptionsSearch({
    optionId, options, lazyOptions, optionsDependencies, name, transformOnSubmit,
    defaultFilter: { ...baseDefaultFilter, ...defaultFilter }
  });

  useEffect(() => {
    setFieldValue(`transformOnSubmit.${name}`, transformOnSubmit || ((value: T) => get(value, optionId)));
  }, []);

  useEffect(() => {
    setDefaultValue(get(value, optionId) || get(defaultValue, optionId));
  }, [ value ]);

  const getOptionLabel = (option: T) => renderOptionLabel ? renderOptionLabel(option) : get(option, optionLabel);

  if (showViewMode) {
    return (<AppViewTextField
      fullWidth
      id={id}
      label={label}
      size="small"
      value={defaultValue ? getOptionLabel(defaultValue) : undefined}
    />);
  }

  return <FormControl
    fullWidth
    error={error}
    variant="standard"
    sx={styles.root}
  >
    <InputLabel
      id={`${id}-label`}
      sx={styles.label}
    >
      {label}
      <AppRequiredAsterisk required={required} />
    </InputLabel>
    <Select
      key={JSON.stringify(_defaultValue)}
      {...omit(props, 'size', 'required', 'value', 'defaultValue')}
      labelId={`${id}-label`}
      onChange={event => setFieldValue(name, allOptions.find(item => get(item, optionId) === event.target.value))}
      defaultValue={_defaultValue}
      sx={styles.select}
    >
      {allowNotChosen && <MenuItem value="">{t('common.notChosen')}</MenuItem>}
      {allOptions.map(option =>
        <MenuItem key={get(option, optionId)} value={get(option, optionId)}>
          {getOptionLabel(option)}
        </MenuItem>)}
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>;
};

export default AppSelect;
