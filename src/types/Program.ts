import { CourseType } from './Course';
import MasterData from './MasterData';

export type Stage = {
  id: number;
  name: string;
}

type Program = {
  id: number;
  name: string;
  subject: string;
  licenseType: MasterData;
  courseType: CourseType;
  description: string;
  maxParticipant: number;
  color: string;
  stages: Stage[];
  duration: number;
}

export default Program;