import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { SEARCH_TRAINER_API_URL } from 'src/constants/apiEndpoints';
import { SearchRequest } from 'src/types/Request';
import { SearchResponse } from 'src/types/Response';
import Trainer from 'src/types/Trainer';
import appBaseQuery from './appBaseQuery';


export const trainerApi = createApi({
  reducerPath: 'trainerApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Trainers' ],
  endpoints: builder => ({
    searchTrainers: builder.query<SearchResponse<Trainer>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_TRAINER_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Trainer>) => result,
      providesTags: [ 'Trainers' ]
    }),
  })
});

export const {
  useLazySearchTrainersQuery,
} = trainerApi;