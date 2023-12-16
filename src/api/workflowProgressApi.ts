import appBaseQuery from './appBaseQuery';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { Response } from 'src/types/Response';
import { GET_WORKFLOW_PROGRESS_STATUS_API_URL, GET_WORKFLOW_PROGRESS_TIMELINE_API_URL, PROCESS_WORKFLOW_PROGRESS_API_URL } from 'src/constants/apiEndpoints';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { WorkflowProgressStatus, WorkflowTimelineNode } from 'src/types/Workflow';
import { WorkflowOptions } from 'src/utils/hooks/useWorkflow';

export const workflowProgressApi = createApi({
  reducerPath: 'workflowProgressApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'ProgressStatus', 'ProgressTimeline' ],
  endpoints: builder => ({
    getWorkflowProgressStatus: builder.query<WorkflowProgressStatus, Omit<WorkflowOptions, 'output'>>({
      query: args => preparePathVariablesUrl(GET_WORKFLOW_PROGRESS_STATUS_API_URL, args),
      transformResponse: (response: Response<WorkflowProgressStatus>) => response.data,
      providesTags: [ 'ProgressStatus' ]
    }),
    getWorkflowProgressTimeline: builder.query<WorkflowTimelineNode[], Omit<WorkflowOptions, 'output'>>({
      query: args => preparePathVariablesUrl(GET_WORKFLOW_PROGRESS_TIMELINE_API_URL, args),
      transformResponse: (response: Response<WorkflowTimelineNode[]>) => response.data,
      providesTags: [ 'ProgressTimeline' ]
    }),
    processWorkflowProgress: builder.mutation<WorkflowProgressStatus, WorkflowOptions & { output?: { [key: string] : unknown} }>({
      query: args => {
        const { output, ...rest } = args;
        return ({
          method: 'POST',
          url: preparePathVariablesUrl(PROCESS_WORKFLOW_PROGRESS_API_URL, rest),
          body: output
        });
      },
      transformResponse: (response: Response<WorkflowProgressStatus>) => response.data,
      invalidatesTags: [ 'ProgressStatus', 'ProgressTimeline' ]
    }),
  })
});

export const {
  useGetWorkflowProgressStatusQuery,
  useGetWorkflowProgressTimelineQuery,
  useProcessWorkflowProgressMutation
} = workflowProgressApi;