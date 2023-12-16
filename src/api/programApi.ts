import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { Response } from 'src/types/Response';
import Program from 'src/types/Program';
import { PROGRAM_API_URL } from 'src/constants/apiEndpoints';
import { OptionsDependencies } from 'src/types/OptionsHook';

export const programApi = createApi({
  reducerPath: 'programApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Program' ],
  endpoints: builder => ({
    getPrograms: builder.query<Program[], OptionsDependencies>({
      query: () => ({
        url: PROGRAM_API_URL,
      }),
      transformResponse: (result: Response<Program[]>) => result.data,
      providesTags: [ 'Program' ],
    }),
  }),
});

export const { useGetProgramsQuery } = programApi;