import { map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useGetWorkflowProgressStatusQuery, useGetWorkflowProgressTimelineQuery, useProcessWorkflowProgressMutation } from 'src/api/workflowProgressApi';
import { TimelineData, TimelineDataStatus } from 'src/components/AppTimeline';
import { useAppDispatch } from 'src/store/hooks';
import { RefetchPolicies } from 'src/types/Request';
import { WorkflowTimelineNode } from 'src/types/Workflow';

export type WorkflowOptions = {
  versionId: number;
  dataId: number;
}

export const useWorkflow = () => {
  const dispatch = useAppDispatch();
  const [ invalidatesTags, setInvalidatesTags ] = useState<{ [reducerPath: string]: string[] } | undefined>();
  const [ process, { data } ] = useProcessWorkflowProgressMutation();

  useEffect(() => {
    if (data && invalidatesTags) {
      Object.entries(invalidatesTags).map(([ reducerPath, tags ]) =>  dispatch({
        type: `${reducerPath}/invalidateTags`,
        payload: tags,
      }));
    }
  }, [ data ]);

  const changeStatus = async (options: WorkflowOptions & {output?: { [key: string]: unknown }}, invalidatesTags?: { [reducerPath: string]: string[] } ) => {
    process(options);
    setInvalidatesTags(invalidatesTags);
  };

  return { changeStatus };

};

export const useWorkflowProgress = (options: WorkflowOptions, refetchPolicies?: RefetchPolicies) => {
  const { data: statusData } = useGetWorkflowProgressStatusQuery(options, refetchPolicies);
  const status = statusData?.work;

  const workflowProps = useWorkflow();

  const changeStatus = async (output?: { [key: string]: unknown }, invalidatesTags?: { [reducerPath: string]: string[] } ) => {
    workflowProps.changeStatus({
      ...options,
      output
    }, invalidatesTags);
  };

  return {
    ...workflowProps,
    changeStatus,
    status
  };
};

export const useWorkflowTimeline = (options: WorkflowOptions, refetchPolicies?: RefetchPolicies) => {
  const { data: timelineData, isLoading: loadingTimeline } = useGetWorkflowProgressTimelineQuery(options, refetchPolicies);
  const { status, ...workflowProgressProps } = useWorkflowProgress(options, refetchPolicies);

  const computeTimelineStatus = (timelineNode: WorkflowTimelineNode) => {
    if (timelineNode.completedDate) {
      return TimelineDataStatus.COMPLETED;
    }
    if (status && timelineNode.id === status?.id) {
      return TimelineDataStatus.IN_PROGRESS;
    }
    return null;
  };

  const timeline = useMemo(() => map(timelineData, item => ({
    id: item.id,
    label: item.name,
    status: computeTimelineStatus(item)
  } as TimelineData)), [ timelineData, status ]);

  return {
    ...workflowProgressProps,
    status,
    timeline,
    loadingTimeline
  };

};

export default useWorkflow;