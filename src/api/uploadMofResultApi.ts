import appBaseQuery, { uploadFileQuery } from './appBaseQuery';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import { CANCEL_UPLOAD_MOF_RESULT_API_URL, GET_PREVIEW_UPLOAD_MOF_RESULT_API_URL, GET_STATUS_UPLOAD_MOF_RESULT_API_URL, SAVE_UPLOAD_MOF_RESULT_API_URL, UPLOAD_MOF_RESULT_API_URL } from 'src/constants/apiEndpoints';
import { Response, SearchResponse } from 'src/types/Response';
import UploadMofResultItem from 'src/types/UploadMofResultItem';
import { ExtraProps, SearchRequest, UploadFileRequest } from 'src/types/Request';
import UploadStatusData from 'src/types/UploadStatus';

export const uploadMofResultApi = createApi({
  reducerPath: 'uploadMofResultApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'UploadStatusData' ],
  endpoints: builder => ({
    uploadMofResultFile: builder.mutation<UploadStatusData, UploadFileRequest>({
      queryFn: uploadFileQuery(UPLOAD_MOF_RESULT_API_URL)
    }),
    getStatusUploadMofResult: builder.query<UploadStatusData, ExtraProps>({
      query: args => preparePathVariablesUrl(GET_STATUS_UPLOAD_MOF_RESULT_API_URL, args),
      transformResponse: (result: Response<UploadStatusData>) => result.data,
      providesTags: [ 'UploadStatusData' ]
    }),
    getUploadMofResultPreview: builder.query<SearchResponse<UploadMofResultItem>, SearchRequest>({
      query: args => ({
        method: 'POST',
        url: preparePathVariablesUrl(GET_PREVIEW_UPLOAD_MOF_RESULT_API_URL, args.extraProps || {}),
        body: args || {}
      }),
      transformResponse: (result: SearchResponse<UploadMofResultItem>) => result,
    }),
    saveUploadMofResult: builder.mutation<void, ExtraProps>({
      query: args => ({
        method: 'POST',
        url: preparePathVariablesUrl(SAVE_UPLOAD_MOF_RESULT_API_URL, args),
      }),
    }),
    cancelUploadMofResult: builder.mutation<void, ExtraProps>({
      query: args => ({
        method: 'DELETE',
        url: preparePathVariablesUrl(CANCEL_UPLOAD_MOF_RESULT_API_URL, args),
      }),
    }),
  })
});

export const {
  useUploadMofResultFileMutation,
  useLazyGetStatusUploadMofResultQuery,
  useLazyGetUploadMofResultPreviewQuery,
  useSaveUploadMofResultMutation,
  useCancelUploadMofResultMutation
} = uploadMofResultApi;