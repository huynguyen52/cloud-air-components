import MasterData from './MasterData';
import Module from './Module';
import Work from './Work';
import WorkLink from './WorkLink';

export type WorkflowVersion = {
  id: number;
  no: number;
  status: MasterData;
  createdDate: string;
}

export type WorkflowProgressStatus = {
  dataId: number;
  workflowVersionId: number;
  work: Work;
  output: { [ key: string ]: string };
  createdDate: string;
  completedDate: string;
}

export interface WorkflowTimelineNode extends Work {
  output: { [ key: string ]: string };
  createdDate: string;
  completedDate: string;
}

type Workflow = {
  id: number;
  name: string;
  version: WorkflowVersion;
  module: Module;
  works: Work[];
  root: number;
  end: number;
  links: WorkLink[];
}

export default Workflow;