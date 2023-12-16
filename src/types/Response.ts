import Role from './Role';

export interface Response<T> {
  status: number;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface SearchResponse<T> extends Response<T[]> {
  page: number;
  limit: number;
  totalRecords: number;
}

export type SubError = {
  code: string;
  message: string;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  subErrors?: SubError[];
  timestamp: string;
}

type SocketResponseUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
}
export interface SocketResponseMetadata {
  from?: SocketResponseUser;
  to?: SocketResponseUser;
  toGroups?: Role[];
  timestamp: string;
}
export interface SocketResponse<T> {
  metadata: SocketResponseMetadata;
  data: T;
}