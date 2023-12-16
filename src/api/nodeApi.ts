import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { Response } from 'src/types/Response';
import { NODE_API_URL } from 'src/constants/apiEndpoints';
import { OptionsDependencies } from 'src/types/OptionsHook';
import { createQueryParamsString } from 'src/utils/apiUtils';

export const nodeApi = createApi({
  reducerPath: 'nodeApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'CHANNELS', 'REGIONS' ],
  endpoints: builder => ({
    getChannels: builder.query<Node[], OptionsDependencies>({
      query: () => NODE_API_URL + createQueryParamsString({ level: 'CHANNEL' }),
      transformResponse: (result: Response<Node[]>) => result.data,
      providesTags: [ 'CHANNELS' ]
    }),
    getRegions: builder.query<Node[], OptionsDependencies>({
      query: args => NODE_API_URL + createQueryParamsString({
        ...args,
        level: 'REGION'
      }),
      transformResponse: (result: Response<Node[]>) => result.data,
      providesTags: [ 'REGIONS' ]
    }),
  })
});

export const {
  useGetChannelsQuery,
  useGetRegionsQuery
} = nodeApi;