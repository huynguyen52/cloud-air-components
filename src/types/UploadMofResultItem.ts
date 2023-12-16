import { UploadedRowStatus } from './UploadStatus';

type UploadMofResultItem =  {
  id: string;
  participantId?: number;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  issueDate: string;
  issuePlace: string;
  score: number;
  status: UploadedRowStatus;
  invalidReasons?: string[];
}

export default UploadMofResultItem;
