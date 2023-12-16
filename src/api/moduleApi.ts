import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';
import { SEARCH_MODULE_API_URL } from 'src/constants/apiEndpoints';
import Module from 'src/types/Module';

export const moduleApi = createApi({
  reducerPath: 'moduleApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Modules', 'GetModules' ],
  endpoints: builder => ({
    searchModules: builder.query<SearchResponse<Module>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_MODULE_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Module>) => result,
      providesTags: [ 'Modules' ]
    })
  })
});

export const {
  useLazySearchModulesQuery,
} = moduleApi;