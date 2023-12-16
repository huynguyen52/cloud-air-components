export interface MultipleIdRequest<T> {
  ids: T[];
}

export type ExtraProps = {[key: string]: string | number};

export interface SearchRequest<T = {[key: string]: unknown}> {
  searchInput: string;
  filter?: T;
  sortColumn?: string;
  sortOrder?: string;
  page: number;
  limit: number;
  extraProps?: ExtraProps;
}

export interface UploadFileRequest {
  file: File;
  extraProps?: ExtraProps;
}

export type RefetchPolicies = {
  pollingInterval?: number;
  refetchOnFocus?: boolean;
  refetchOnReconnect?: boolean;
}