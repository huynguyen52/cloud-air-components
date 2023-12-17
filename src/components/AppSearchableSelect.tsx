import { Autocomplete, AutocompleteProps, Input, useTheme } from '@mui/material';
import { AppTextField } from './AppTextField';
import { ReactNode, useEffect, useRef, useState } from 'react';
import OptionsHook, { LazyOptionsHook, OptionsDependencies } from 'src/types/OptionsHook';
import { DEFAULT_LAZY_OPTIONS_COUNT } from 'src/constants/common';
import { useTranslation } from 'react-i18next';
import { SearchRequest } from 'src/types/Request';
import useOptionsSearch from 'src/utils/hooks/useOptionsSearch';
import { get, isArray, isNil, isString, noop, omit } from 'lodash';
import { AppViewTextField } from './AppViewTextField';

export interface AppSearchableSelectProps<T> extends Omit<AutocompleteProps<T, boolean, false, boolean>, 'renderInput' | 'options' | 'onChange' | 'size'> {
  options?: OptionsHook<T>;
  lazyOptions?: LazyOptionsHook<T>;
  optionsDependencies?: OptionsDependencies;
  id: string;
  name: string;
  label: string;
  optionId: string;
  optionLabel?: string;
  transformOnSubmit?: (value: T) => unknown;
  setFieldValue: (field: string, value: unknown) => void;
  defaultValue: T | T[];
  error?: boolean;
  helperText?: ReactNode;
  defaultFilter?: { [key: string]: unknown };
  showViewMode?: boolean;
  multiple?: boolean;
  required?: boolean;
  renderOptionLabel?: (option: T) => string | undefined;
  size?: 'small' | 'normal';
}

const baseDefaultFilter: SearchRequest = {
  searchInput: '',
  page: 0,
  limit: DEFAULT_LAZY_OPTIONS_COUNT,
};

export const AppSearchableSelect = <T,>(props: AppSearchableSelectProps<T>) => {
  const {
    name, label, id, setFieldValue, optionId, defaultValue, options,
    lazyOptions, optionsDependencies, optionLabel = 'name', defaultFilter, showViewMode = false,
    transformOnSubmit, multiple, required, error, helperText, renderOptionLabel, value, size='normal', onBlur, freeSolo
  } = props;
  const { t } = useTranslation();
  const inputRef = useRef();
  const theme = useTheme();

  const [ _defaultValue, setDefaultValue ] = useState<typeof value>(defaultValue);

  useEffect(() => {
    setDefaultValue(value || defaultValue);
  }, [ value ]);

  const { filterOptions, onSearchChange } = useOptionsSearch<T>({
    optionId, options, lazyOptions, optionsDependencies, setFieldValue, name, transformOnSubmit,
    defaultFilter: { ...baseDefaultFilter, ...defaultFilter },
    values: _defaultValue
  });

  const getOptionLabel = (option: string | T) => {
    if (isString(option)) return option;
    return (renderOptionLabel && !isNil(option) ? (renderOptionLabel(option) || '') :
      get(option, optionLabel, '')) as string;
  };

  if (showViewMode) {
    return (<AppViewTextField
      fullWidth
      id={id}
      label={label}
      size="small"
      value={isArray(_defaultValue) ?
        _defaultValue.map(item => getOptionLabel(item)).join(', ') :
        getOptionLabel(_defaultValue as T)}
    />);
  }

  return <>
    <Input type="hidden" name={name} inputRef={inputRef} />
    <Autocomplete
      key={JSON.stringify(_defaultValue)}
      {...omit(props, 'value', 'size')}
      sx={{
        mt: -3,
        ...props.sx,
        '.MuiAutocomplete-input': {
          padding: `${theme.spacing(1)} ${theme.spacing(1.5)} !important`
        },
        '.MuiOutlinedInput-root': {
          borderRadius: theme.typography.pxToRem(6)
        }
      }}
      multiple={multiple}
      filterSelectedOptions
      defaultValue={_defaultValue}
      options={filterOptions}
      onInputChange={(_, value) => onSearchChange(value)}
      getOptionLabel={getOptionLabel}
      onBlur={event => {
        if (freeSolo) {
          setFieldValue(name, (event.target as HTMLInputElement).value);
        }
        return onBlur && onBlur(event);
      }}
      onChange={(_, values) => setFieldValue(name, values)}
      noOptionsText={t(lazyOptions ? 'common.typeToSearch' : 'common.noOptions', { label })}
      renderInput={params => (
        <AppTextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          setFieldValue={noop}
          size={size}
          placeholder={lazyOptions ? t('common.typeToSearch', { label }) : label}
        />
      )}
    />
  </>;
};
