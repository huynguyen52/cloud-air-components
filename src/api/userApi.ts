import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { GET_CURRENT_USER_API_URL, SEARCH_USER_API_URL, USER_API_URL, USER_STATUS_API_URL } from 'src/constants/apiEndpoints';
import { setUserDetails } from 'src/store/reducer';
import _ from 'lodash';
import { FormikValues } from 'formik';
import { Response, SearchResponse } from 'src/types/Response';
import { SearchRequest, MultipleIdRequest } from 'src/types/Request';
import { UserDetails, User } from 'src/types/User';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'User' ],
  endpoints: builder => ({
    getCurrentUser: builder.query<UserDetails, void>({
      query: () => ({
        url: GET_CURRENT_USER_API_URL
      }),
      transformResponse: (result: Response<UserDetails>) => result.data,
      onQueryStarted: (_args, { dispatch, queryFulfilled }) => {
        queryFulfilled.then(({ data }) => dispatch(setUserDetails(data))).catch(_.noop);
      },
    }),
    searchUser: builder.query<SearchResponse<User>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_USER_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<User>) => result,
      providesTags: [ 'User' ]
    }),
    createUser: builder.mutation<User, FormikValues>({
      query: args => ({
        method: 'POST',
        url: USER_API_URL,
        body: args
      }),
      transformResponse: (result: Response<User>) => result.data,
      invalidatesTags: [ 'User' ]
    }),
    updateUser: builder.mutation<User, FormikValues>({
      query: args => ({
        method: 'PUT',
        url: USER_API_URL,
        body: args
      }),
      transformResponse: (result: Response<User>) => result.data,
      invalidatesTags: [ 'User' ]
    }),
    changeUserState: builder.mutation<User[], MultipleIdRequest<string> & { isActive: boolean } >({
      query: args => ({
        method: 'PUT',
        url: USER_STATUS_API_URL,
        body: args
      }),
      transformResponse: (result: Response<User[]>) => result.data,
      invalidatesTags: [ 'User' ]
    })
  })
});

export const {
  useGetCurrentUserQuery,
  useLazySearchUserQuery,
  useCreateUserMutation,
  useChangeUserStateMutation,
  useUpdateUserMutation
} = userApi;