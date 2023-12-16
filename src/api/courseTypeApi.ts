import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { COURSE_TYPE_API_URL, COURSE_TYPE_ID_API_URL, SEARCH_TYPE_COURSE_API_URL } from 'src/constants/apiEndpoints';
import { Response,SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { FormikValues } from 'formik';
import { CourseType } from 'src/types/Course';

export const courseTypeApi = createApi({
  reducerPath: 'courseTypeApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'CourseType' ],
  endpoints: builder => ({
    searchCourseTypes: builder.query<SearchResponse<CourseType>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_TYPE_COURSE_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<CourseType>) => result,
      providesTags: [ 'CourseType' ]
    }),
    createCourseType: builder.mutation<CourseType, FormikValues>({
      query: args => ({
        method: 'POST',
        url: COURSE_TYPE_API_URL,
        body: args
      }),
      transformResponse: (result: Response<CourseType>) => result.data,
      invalidatesTags: [ 'CourseType' ]
    }),
    updateCourseType: builder.mutation<CourseType, FormikValues>({
      query: args => ({
        method: 'PUT',
        url: preparePathVariablesUrl(COURSE_TYPE_ID_API_URL, { courseTypeId: args.id }),
        body: args
      }),
      transformResponse: (result: Response<CourseType>) => result.data,
      invalidatesTags: [ 'CourseType' ]
    }),
  })
});

export const {
  useCreateCourseTypeMutation,
  useLazySearchCourseTypesQuery,
  useUpdateCourseTypeMutation,
} = courseTypeApi;
