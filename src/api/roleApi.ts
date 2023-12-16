import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import Role from 'src/types/Role';
import { ROLE_API_URL, SEARCH_ROLE_API_URL } from 'src/constants/apiEndpoints';
import { Response, SearchResponse } from 'src/types/Response';
import { FormikValues } from 'formik';
import { SearchRequest, MultipleIdRequest } from 'src/types/Request';

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Role' ],
  endpoints: builder => ({
    searchRole: builder.query<SearchResponse<Role>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_ROLE_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Role>) => result,
      providesTags: [ 'Role' ]
    }),
    createRole: builder.mutation<Role, FormikValues>({
      query: args => ({
        method: 'POST',
        url: ROLE_API_URL,
        body: args
      }),
      transformResponse: (result: Response<Role>) => result.data,
      invalidatesTags: [ 'Role' ]
    }),
    updateRole: builder.mutation<Role, FormikValues>({
      query: args => ({
        method: 'PUT',
        url: ROLE_API_URL,
        body: args
      }),
      transformResponse: (result: Response<Role>) => result.data,
      invalidatesTags: [ 'Role' ]
    }),
    deleteRoles: builder.mutation<Role[], MultipleIdRequest<number>>({
      query: args => ({
        method: 'DELETE',
        url: ROLE_API_URL,
        body: args
      }),
      transformResponse: (result: Response<Role[]>) => result.data,
      invalidatesTags: [ 'Role' ]
    }),
  })
});

export const {
  useLazySearchRoleQuery,
  useUpdateRoleMutation,
  useCreateRoleMutation,
  useDeleteRolesMutation
} = roleApi;