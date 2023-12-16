import appBaseQuery from './appBaseQuery';
import { SIGNIN_API_URL, SIGNOUT_API_URL } from 'src/constants/apiEndpoints';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { clearUserDetails, setUserDetails } from 'src/store/reducer';
import { Response } from 'src/types/Response';
import _ from 'lodash';
import { UserDetails } from 'src/types/User';
import { FormikValues } from 'formik';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: appBaseQuery,
  endpoints: builder => ({
    signIn: builder.mutation<UserDetails, FormikValues>({
      query: data => ({
        url: SIGNIN_API_URL,
        method: 'POST',
        body: data,
      }),
      transformResponse: (result: Response<{ user: UserDetails }>) => result.data.user,
      onQueryStarted: (_args, { dispatch, queryFulfilled }) => {
        queryFulfilled.then(({ data }) => dispatch(setUserDetails(data))).catch(_.noop);
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: SIGNOUT_API_URL
      }),
      onQueryStarted: (_args, { dispatch, queryFulfilled }) => {
        queryFulfilled.then(() => dispatch(clearUserDetails())).catch(_.noop);
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignOutMutation
} = authApi;