import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { Response, SearchResponse } from 'src/types/Response';
import { SearchRequest } from 'src/types/Request';
import Workflow from 'src/types/Workflow';
import {
  SEARCH_WORKFLOW_API_URL,
  WORKFLOW_API_URL,
  WORKFLOW_ID_API_URL,
  RESTORE_WORKFLOW_API_URL,
  ARCHIVE_WORKFLOW_API_URL,
  CLONE_WORKFLOW_API_URL
} from 'src/constants/apiEndpoints';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { FormikValues } from 'formik';

export const workflowApi = createApi({
  reducerPath: 'workflowApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'Workflows', 'Workflow' ],
  endpoints: builder => ({
    searchWorkflows: builder.query<SearchResponse<Workflow>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_WORKFLOW_API_URL,
        body: args
      }),
      transformResponse: (result: SearchResponse<Workflow>) => result,
      providesTags: [ 'Workflows' ]
    }),
    getWorkflow: builder.query<Workflow, number>({
      query: args => preparePathVariablesUrl(WORKFLOW_ID_API_URL, { workflowId: args }),
      transformResponse: (result: Response<Workflow>) => result.data,
      providesTags: [ 'Workflow' ]
    }),
    createWorkflow: builder.mutation<Workflow, FormikValues>({
      query: args => ({
        method: 'POST',
        url: WORKFLOW_API_URL,
        body: args
      }),
      transformResponse: (result: Response<Workflow>) => result.data,
      invalidatesTags: [ 'Workflows' ]
    }),
    updateWorkflow: builder.mutation<Workflow, FormikValues>({
      query: args => ({
        method: 'PUT',
        url: preparePathVariablesUrl(WORKFLOW_ID_API_URL, { workflowId: args.id }),
        body: args
      }),
      transformResponse: (result: Response<Workflow>) => result.data,
      invalidatesTags: [ 'Workflows' ]
    }),
    archiveWorkflow: builder.mutation<Workflow,number >({
      query: workflowId => ({
        method: 'PUT',
        url: preparePathVariablesUrl(ARCHIVE_WORKFLOW_API_URL, { workflowId }),
      }),
      transformResponse: (result: Response<Workflow>) => result.data,
      invalidatesTags: [ 'Workflows' ]
    }),
    restoreWorkflow: builder.mutation<Workflow,number >({
      query: workflowId => ({
        method: 'PUT',
        url: preparePathVariablesUrl(RESTORE_WORKFLOW_API_URL, { workflowId }),
      }),
      transformResponse: (result: Response<Workflow>) => result.data,
      invalidatesTags: [ 'Workflows' ]
    }),
    cloneWorkflow: builder.mutation<Workflow,number>({
      query: workflowId => ({
        method: 'POST',
        url: preparePathVariablesUrl(CLONE_WORKFLOW_API_URL, { workflowId }),
      }),
      transformResponse: (result: Response<Workflow>) => result.data,
      invalidatesTags: [ 'Workflows' ]
    })
  })
});

export const {
  useLazySearchWorkflowsQuery,
  useLazyGetWorkflowQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useRestoreWorkflowMutation,
  useArchiveWorkflowMutation,
  useCloneWorkflowMutation,
} = workflowApi;