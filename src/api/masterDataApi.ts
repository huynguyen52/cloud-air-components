import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { MASTER_DATA_API } from 'src/constants/apiEndpoints';
import MasterData from 'src/types/MasterData';
import { Response } from 'src/types/Response';
import { OptionsDependencies } from 'src/types/OptionsHook';
import { createQueryParamsString } from 'src/utils/apiUtils';

const createMasterDataQuery = (type: string, args: OptionsDependencies) => MASTER_DATA_API + createQueryParamsString({
  ...args,
  type
});

export const masterDataApi = createApi({
  reducerPath: 'masterDataApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'ROLE_TYPE', 'WORKFLOW_STATUS', 'PARTNER', 'BRANCH', 'EXAM_TYPE', 'EXAM_CATEGORY', 'TEST_RESULT' ],
  endpoints: builder => ({
    getRoleType: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('ROLE_TYPE', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'ROLE_TYPE' ]
    }),
    getWorkflowStatus: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('WORKFLOW_STATUS', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'WORKFLOW_STATUS' ]
    }),
    getPartners: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('PARTNER', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'PARTNER' ]
    }),
    getBranch: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('BRANCH', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'BRANCH' ]
    }),
    getMofExamTypes: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('EXAM_TYPE', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'EXAM_TYPE' ]
    }),
    getMofExamCategories: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('EXAM_CATEGORY', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'EXAM_CATEGORY' ]
    }),
    getTestResults: builder.query<MasterData[], OptionsDependencies>({
      query: args => createMasterDataQuery('TEST_RESULT', args),
      transformResponse: (result: Response<MasterData[]>) => result.data,
      providesTags: [ 'TEST_RESULT' ]
    }),
  })
});

export const {
  useGetRoleTypeQuery,
  useGetWorkflowStatusQuery,
  useGetPartnersQuery,
  useGetBranchQuery,
  useGetMofExamTypesQuery,
  useGetMofExamCategoriesQuery,
  useGetTestResultsQuery
} = masterDataApi;