import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { Response } from 'src/types/Response';
import Location from 'src/types/Location';
import { LOCATION_API_URL } from 'src/constants/apiEndpoints';
import { OptionsDependencies } from 'src/types/OptionsHook';
import { createQueryParamsString } from 'src/utils/apiUtils';

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'CourseLocation', 'MOFLocation' ],
  endpoints: builder => ({
    getCourseLocations: builder.query<Location[], OptionsDependencies>({
      query: options => ({
        url: LOCATION_API_URL + createQueryParamsString({ type:'COURSE_ADDRESS' }),
        ...options,
      }),
      transformResponse: (result: Response<Location[]>) => result.data,
      providesTags: [ 'CourseLocation' ],
    }),
    getMofLocations: builder.query<Location[], OptionsDependencies>({
      query: options => ({
        url: LOCATION_API_URL + createQueryParamsString({ type:'MOF_ADDRESS' }),
        ...options,
      }),
      transformResponse: (result: Response<Location[]>) => result.data,
      providesTags: [ 'MOFLocation' ],
    }),
  }),
});

export const { useGetCourseLocationsQuery, useGetMofLocationsQuery } = locationApi;
