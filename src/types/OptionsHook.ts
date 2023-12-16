import { QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { UseQuery, UseLazyQuery, LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { AppBaseQuery } from 'src/api/appBaseQuery';
import { SearchResponse } from 'src/types/Response';
import { SearchRequest } from './Request';

export type OptionsDependencies = {
  timestamp?: string;
  type?: string;
  parent?: string[];
};
type OptionsHookQueryDefinition<T> = QueryDefinition<OptionsDependencies, AppBaseQuery, string, T[], string>;
type LazyOptionsHookQueryDefinition<T> = QueryDefinition<SearchRequest, AppBaseQuery, string, SearchResponse<T>, string>;
type OptionsHook<T> = UseQuery<OptionsHookQueryDefinition<T>>;
export type LazyOptionsHook<T> = UseLazyQuery<LazyOptionsHookQueryDefinition<T>>;
export type LazyOptionsTrigger<T> = LazyQueryTrigger<QueryDefinition<SearchRequest, AppBaseQuery, string, SearchResponse<T>>>;
export const isSearchResponse = <T,>(object: T[] | SearchResponse<T> | undefined) => object && 'page' in object && 'limit' in object && 'totalRecords' in object;

export default OptionsHook;