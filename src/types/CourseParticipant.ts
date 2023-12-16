import { AoLExamResult } from './AolExam';
import MasterData from './MasterData';
import MofExamInformation from './MofExamInformation';
import { Stage } from './Program';
import { User } from './User';

export interface PersonalIdentification{
  idNumber: string;
  type: MasterData;
  issueDate: string;
  issuePlace: string;
}

export interface AttendanceResult {
  stage: Stage;
  result: MasterData;
}

export interface CourseParticipant {
  id: string;
  dateOfBirth: string;
  birthPlace: string;
  email: string;
  fullName: string;
  education: MasterData;
  gender: MasterData;
  personalIndentification: PersonalIdentification;
  maritalStatus: MasterData;
  mobilePhone: string;
  nationality: MasterData;
  religion: MasterData;
  title: string;
  terminateDate: string;
  agentCode: string;
  modifiedDate: string;
  modifiedUser: User;
  note: string;
  aolResults: AoLExamResult[];
  mofResult: MasterData;
  finalResult: MasterData;
  attendances: AttendanceResult[];
  mofExamInfo: MofExamInformation;
}
