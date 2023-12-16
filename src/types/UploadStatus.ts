
export enum UploadStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum UploadedRowStatus {
  INVALID = 'INVALID',
  VALID = 'VALID',
}

type UploadStatusData = {
  status: UploadStatus;
  uploadedBy: string;
  total: number;
  processed: number;
  success: number;
  failed: number;
  fileName: string;
  fileSize: number;
}

export default UploadStatusData;
