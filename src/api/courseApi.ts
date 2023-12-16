import appBaseQuery from './appBaseQuery';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { Response, SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';
import { COURSE_API_URL, COURSE_ID_API_URL, COURSE_TRAINER_API_URL, REGISTER_COURSE_API_URL, ROLLBACK_COURSE_API_URL, SEARCH_COURSE_API_URL } from 'src/constants/apiEndpoints';
import Course from 'src/types/Course';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { FormikValues } from 'formik';
import { map } from 'lodash';
import MofExamInformation from 'src/types/MofExamInformation';

export const convertSubmitData = (values: FormikValues) => ({
  ...values,
  mofExams: map(values.mofExams, (exam: MofExamInformation) => ({
    ...exam,
    type: exam.type?.code,
    category: exam.category?.code,
    location: exam.location?.id
  }))
});

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Courses', 'Course' ],
  endpoints: builder => ({
    searchCourses: builder.query<SearchResponse<Course>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_COURSE_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Course>) => result,
      providesTags: [ 'Courses' ]
    }),
    createCourse: builder.mutation<Course, FormikValues>({
      query: args => ({
        method: 'POST',
        url: COURSE_API_URL,
        body: convertSubmitData(args)
      }),
      transformResponse: (result: Response<Course>) => result.data,
      invalidatesTags: [ 'Courses', 'Course' ]
    }),
    updateCourse: builder.mutation<Course, FormikValues>({
      query: args => ({
        method: 'PUT',
        url: preparePathVariablesUrl(COURSE_ID_API_URL, { courseId: args.id }),
        body: convertSubmitData(args)
      }),
      transformResponse: (result: Response<Course>) => result.data,
      invalidatesTags: [ 'Courses', 'Course' ]
    }),
    getCourse: builder.query<Course, number>({
      query: args => preparePathVariablesUrl(COURSE_ID_API_URL, { courseId: args }),
      transformResponse: (result: Response<Course>) => result.data,
      providesTags: [ 'Course' ]
    }),
    registerCourse: builder.mutation<Course, number>({
      query: args => ({
        url: preparePathVariablesUrl(REGISTER_COURSE_API_URL, { courseId: args }),
        method: 'PUT'
      }),
      transformResponse: (result: Response<Course>) => result.data,
      invalidatesTags: [ 'Course' ]
    }),
    rollbackCourse: builder.mutation<Course, number>({
      query: args => ({
        url: preparePathVariablesUrl(ROLLBACK_COURSE_API_URL, { courseId: args }),
        method: 'PUT'
      }),
      transformResponse: (result: Response<Course>) => result.data,
      invalidatesTags: [ 'Course' ]
    }),
    deleteCourseTrainers: builder.mutation<Course, number>({
      query: args => ({
        url: preparePathVariablesUrl(COURSE_TRAINER_API_URL, { courseId: args }),
        method: 'DELETE'
      }),
      transformResponse: (result: Response<Course>) => result.data,
      invalidatesTags: [ 'Course' ]
    })
  })
});

export const {
  useLazySearchCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseQuery,
  useRegisterCourseMutation,
  useRollbackCourseMutation,
  useDeleteCourseTrainersMutation
} = courseApi;