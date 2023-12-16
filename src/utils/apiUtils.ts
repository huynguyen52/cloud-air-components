import { isArray, isEmpty, isNil } from 'lodash';

export const preparePathVariablesUrl = (url: string, pathVariables: {[key: string]: (string | number | undefined)}) =>
  Object.entries(pathVariables).reduce((result, [ key, value ]) => result.replace(`{${key}}`, value?.toString() || ''), url);

export const createQueryParamsString = (data: { [key: string]: unknown }) => Object.entries(data).reduce((result, [ key, value ]) => {
  if ((isArray(value) && isEmpty(value)) || isNil(value)) return result;
  result += isEmpty(result) ? '?' : '&';
  result += isArray(value) ? `${key}=${value.map(item => item.toString()).join(',')}`: `${key}=${value}`;
  return result;
}, '');