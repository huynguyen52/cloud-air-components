import Program from './Program';
import { WorkflowVersion } from './Workflow';
import Workflow from './Workflow';
import Location from './Location';
import Node from './Node';
import { CourseTrainer } from './CourseTrainer';
import MofExamInformation from './MofExamInformation';

type CourseStatus = {
  workflowVersionId: number;
  id: number;
  name: string;
  statusName: string;
  config?: { [key: string]: unknown };
}

export type CourseType = {
  id: number;
  name: string;
  workflow?: Workflow;
  averageProcessDays: number;
}

type Course = {
  id: number;
  primaryCourse?: Course;
  program: Program;
  code: string;
  trainers: CourseTrainer[];
  name: string;
  status: CourseStatus;
  processWorkflow: WorkflowVersion;
  channel: Node;
  startDate: string;
  endDate: string;
  region: Node;
  location: Location;
  stagesCount: number;
  mofExams: MofExamInformation;
}

export default Course;
