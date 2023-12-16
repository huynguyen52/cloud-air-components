import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { SEARCH_COURSE_PARITICIPANT_API_URL } from 'src/constants/apiEndpoints';
import { CourseParticipant } from 'src/types/CourseParticipant';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';

export const courseParticipantApi = createApi({
  reducerPath: 'courseParticipantApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'CourseParticipants' ],
  endpoints: builder => ({
    searchCourseParticipants: builder.query<SearchResponse<CourseParticipant>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: preparePathVariablesUrl(SEARCH_COURSE_PARITICIPANT_API_URL, args.extraProps || {}),
        body: args
      }),
      transformResponse: (result: SearchResponse<CourseParticipant>) => result,
      providesTags: [ 'CourseParticipants' ]
    }),
  })
});

export const {
  useLazySearchCourseParticipantsQuery,
} = courseParticipantApi;
