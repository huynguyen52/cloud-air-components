import { clone, debounce, get, isArray, isEmpty, isFunction, isString } from 'lodash';
import { useEffect, useState } from 'react';
import { DEFAULT_INPUT_DEBOUNCE } from 'src/constants/common';
import OptionsHook, { LazyOptionsHook, OptionsDependencies, isSearchResponse } from 'src/types/OptionsHook';
import { SearchRequest } from 'src/types/Request';
import { SearchResponse } from 'src/types/Response';

export interface OptionsSearchConfig<T> {
  optionId: string;
  name: string;
  defaultFilter: SearchRequest;
  setFieldValue?: (field: string, value: unknown) => void;
  options?: OptionsHook<T> | T[];
  lazyOptions?: LazyOptionsHook<T>;
  optionsDependencies?: OptionsDependencies;
  values?: string | T | (string | T)[] | null;
  modifyOptions?: (item: T) => T;
  transformOnSubmit?: (value: T) => unknown;
}

const useOptionsSearch = <T,>(config: OptionsSearchConfig<T>) => {
  const {
    optionId, options, optionsDependencies, setFieldValue, lazyOptions,
    defaultFilter, values, name, modifyOptions, transformOnSubmit
  } = config;
  const [ currentOptions, setCurrentOptions ] = useState<Map<string | number, T>>(new Map());

  const useOptions = () => {
    if (options) {
      return {
        fetchOptions: undefined,
        optionsResult: isFunction(options) ? options(optionsDependencies || {} as OptionsDependencies) :
          isArray(options) ? { isLoading: false, data: options } : undefined
      };
    }
    if (lazyOptions) {
      const [ trigger, result ] = lazyOptions();
      return {
        fetchOptions: trigger,
        optionsResult: result
      };
    }
    return {};
  };

  const { fetchOptions, optionsResult } = useOptions();

  const getFetchedOptions = () => {
    if (!optionsResult?.isLoading && optionsResult?.data) {
      if (isSearchResponse(optionsResult?.data)) {
        return (optionsResult?.data as SearchResponse<T>).data;
      } else {
        return (optionsResult?.data as T[]);
      }
    }
    return [];
  };

  const addNewOptions = (newOptions: T[]) => {
    const newOptionsMap = clone(currentOptions);
    const finalNewOptions = modifyOptions ? newOptions.map(item => modifyOptions(item)) : newOptions;
    finalNewOptions.filter(option => !currentOptions.has(get(option, optionId)))
      .forEach(option => newOptionsMap.set(get(option, optionId), option));
    setCurrentOptions(newOptionsMap);
  };

  const replaceWithNewOptions = (newOptions: T[]) => {
    const newOptionsMap = new Map();
    newOptions.forEach(option => newOptionsMap.set(get(option, optionId), option));
    setCurrentOptions(newOptionsMap);
  };

  const setupTransformOnSubmit = () => {
    setFieldValue && setFieldValue(`transformOnSubmit.${name}`, transformOnSubmit || ((value: T) => get(value, optionId)));
  };

  useEffect(() => {
    setupTransformOnSubmit();
    if (fetchOptions) {
      fetchOptions(defaultFilter);
    }
  }, []);

  useEffect(() => {
    if (fetchOptions) {
      fetchOptions(defaultFilter);
    }
  }, [ JSON.stringify(defaultFilter) ]);

  useEffect(() => {
    if (isArray(values)) {
      addNewOptions(values.filter(item => !isString(item)) as T[]);
    }
  }, [ values ]);

  useEffect(() => {
    setupTransformOnSubmit();
    const newOptions = getFetchedOptions();
    isEmpty(optionsDependencies) ? addNewOptions(newOptions) : replaceWithNewOptions(newOptions);
  }, [ optionsResult?.data ]);

  useEffect(() => {
    if (options && isArray(options)) {
      replaceWithNewOptions(options);
    }
  }, [ options ]);

  const onSearchChange = debounce((value: string) => {
    if (fetchOptions) {
      fetchOptions({
        ...defaultFilter,
        searchInput: value || ''
      });
    }
  }, DEFAULT_INPUT_DEBOUNCE);

  const filterOptions = Array.from(currentOptions.values())
    .filter(option => isArray(values) ? !values?.find(item => get(item, optionId) === get(option, optionId)) :
      get(values, optionId) !== get(option, optionId));

  return {
    onSearchChange,
    allOptions: Array.from(currentOptions.values()),
    filterOptions,
  };
};

export default useOptionsSearch;