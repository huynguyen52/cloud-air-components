import Grid from '@mui/material/Grid';
import OptionsHook, { LazyOptionsHook, OptionsDependencies } from 'src/types/OptionsHook';
import { ReactNode, useEffect, useState } from 'react';
import { DEFAULT_LAZY_OPTIONS_COUNT, INFINITE_PAGE_SIZE } from 'src/constants/common';
import { SearchRequest } from 'src/types/Request';
import useOptionsSearch from 'src/utils/hooks/useOptionsSearch';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { AppList } from './AppList';
import { FormControl, FormHelperText } from '@mui/material';

export interface AppTransferListProps<T> {
  defaultValue: T[];
  values: T[];
  options?: OptionsHook<T>;
  lazyOptions?: LazyOptionsHook<T>;
  optionsDependencies?: OptionsDependencies;
  id: string;
  name: string;
  label: string;
  setFieldValue: (field: string, value: unknown) => void;
  optionId: string;
  optionLabel: string;
  transformOnSubmit?: (value: T) => unknown;
  helperText?: ReactNode;
  defaultFilter?: { [key: string]: unknown };
  height?: string | number;
  enableSearchOptions?: boolean;
  enableSearchSelected?: boolean;
  renderSelectedItemText?: (value: T) => ReactNode;
  renderItemText?: (value: T) => ReactNode;
  renderCollapse?: (item: T, onChangeValues: (values: T[]) => void) => ReactNode;
  collapses?: (string | number)[];
  handleCollapse?: (id: string | number) => void;
  modifySearchResponse?: (item: T) => T;
  error?: boolean;
}

export const AppTransferList = <T,>(props: AppTransferListProps<T>) => {
  const {
    defaultValue, options, lazyOptions, optionsDependencies, height = 250,
    id, name, optionId, optionLabel, helperText, setFieldValue, defaultFilter = {},
    enableSearchOptions, enableSearchSelected, label, renderItemText,
    collapses, handleCollapse, renderCollapse, modifySearchResponse,
    renderSelectedItemText, error, values, transformOnSubmit
  } = props;

  const { t } = useTranslation();
  const [ currentValues, setCurrentValues ] = useState<T[]>(defaultValue || []);

  useEffect(() => {
    values && setCurrentValues(values);
  }, [ values ]);

  const baseDefaultFilter: SearchRequest = {
    searchInput: '',
    page: 0,
    limit: enableSearchOptions ? DEFAULT_LAZY_OPTIONS_COUNT : INFINITE_PAGE_SIZE,
  };

  const { filterOptions, onSearchChange } = useOptionsSearch<T>({
    optionId, transformOnSubmit, setFieldValue, options, lazyOptions, optionsDependencies, name,
    defaultFilter: { ...baseDefaultFilter, ...defaultFilter },
    modifyOptions: modifySearchResponse,
    values: currentValues
  });

  const handleToggleValue = (value: T) => {
    let _values = [];
    if (currentValues.find(item => get(item, optionId) === get(value, optionId))) {
      _values = currentValues.filter(item => get(item, optionId) !== get(value, optionId));
    } else {
      _values = [ ...currentValues, value ];
    }
    onChangeValues(_values);
  };

  const onChangeValues = (_values: T[]) => {
    setCurrentValues(_values);
    setFieldValue(name, _values);
  };

  return (
    <FormControl fullWidth error={error}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item md={6}>
          <AppList
            items={currentValues}
            optionId={optionId}
            optionLabel={optionLabel}
            id={`selected-${id}`}
            label={`${t('common.selected')} ${label}`}
            searchable={enableSearchSelected}
            height={height}
            onItemClick={handleToggleValue}
            renderItemText={renderSelectedItemText || renderItemText}
            renderCollapse={item => renderCollapse && renderCollapse(item, onChangeValues)}
            collapses={collapses}
            handleCollapse={handleCollapse}
          />
        </Grid>
        <Grid item md={6}>
          <AppList
            items={filterOptions}
            optionId={optionId}
            optionLabel={optionLabel}
            id={`available-${id}`}
            label={`${t('common.available')} ${label}`}
            searchable={enableSearchOptions}
            onSearchChange={onSearchChange}
            height={height}
            onItemClick={handleToggleValue}
            renderItemText={renderItemText}
          />
        </Grid>
      </Grid>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
