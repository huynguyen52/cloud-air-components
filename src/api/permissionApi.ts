import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { SEARCH_PERMISSION_API_URL, PERMISSION_API_URL } from 'src/constants/apiEndpoints';
import Permission from 'src/types/Permission';
import { Response, SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Permission' ],
  endpoints: builder => ({
    searchPermission: builder.query<SearchResponse<Permission>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_PERMISSION_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Permission>) => result,
      providesTags: [ 'Permission' ]
    }),
    updatePermission: builder.mutation<Permission, Permission>({
      query: args => ({
        method: 'PUT',
        url: PERMISSION_API_URL,
        body: args
      }),
      transformResponse: (result: Response<Permission>) => result.data,
      invalidatesTags: [ 'Permission' ]
    })
  })
});

export const {
  useLazySearchPermissionQuery,
  useUpdatePermissionMutation
} = permissionApi;