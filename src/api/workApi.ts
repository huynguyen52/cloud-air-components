import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';
import { SEARCH_WORK_API_URL } from 'src/constants/apiEndpoints';
import Work from 'src/types/Work';

export const workApi = createApi({
  reducerPath: 'workApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Work' ],
  endpoints: builder => ({
    searchWork: builder.query<SearchResponse<Work>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_WORK_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Work>) => result,
      providesTags: [ 'Work' ]
    }),
  })
});

export const {
  useLazySearchWorkQuery,
} = workApi;