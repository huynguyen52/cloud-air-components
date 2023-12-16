import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { Response } from 'src/types/Response';
import { AOL_EXAM_API_URL } from 'src/constants/apiEndpoints';
import appBaseQuery from './appBaseQuery';
import AolExam from 'src/types/AolExam';
import { OptionsDependencies } from 'src/types/OptionsHook';

export const aolExamApi = createApi({
  reducerPath: 'aolExamApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'AolExam' ],
  endpoints: builder => ({
    getAolExam: builder.query<AolExam[], OptionsDependencies>({
      query: () => AOL_EXAM_API_URL,
      transformResponse: (result: Response<AolExam[]>) => result.data,
      providesTags: [ 'AolExam' ]
    }),
  })
});

export const {
  useGetAolExamQuery
} = aolExamApi;
