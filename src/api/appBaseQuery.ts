import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { BASE_API_URL, REFRESH_TOKEN_API_URL } from '../constants/apiEndpoints';
import { setUserDetails } from 'src/store/reducer';
import routes from 'src/router/routes';
import { AlertState, showAlert, showAutohideAlert } from 'src/components/AppAlert/reducer';
import { AlertType } from 'src/constants/enums';
import { isObject, omit } from 'lodash';
import { ErrorResponse, Response } from 'src/types/Response';
import { UserDetails } from 'src/types/User';
import { UploadFileRequest } from 'src/types/Request';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';
import UploadStatusData from 'src/types/UploadStatus';

// Create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: headers => headers.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone),
  credentials: 'include'
});

export const uploadFileQuery = (url: string) => (async (args: UploadFileRequest, api: BaseQueryApi) => {
  const alertConfig = {
    id: api.endpoint,
    static: false
  } as AlertState;
  // Show alert loading
  api.dispatch(showAlert({
    ...alertConfig,
    type: AlertType.LOADING,
    titleSchema: 'alert.title.POST',
  }));
  const bodyFormData: FormData = new FormData();
  bodyFormData.append('file', args.file);
  const response: Response<UploadStatusData> = await fetch(BASE_API_URL + preparePathVariablesUrl(url, args.extraProps || {}), {
    method: 'POST',
    body: bodyFormData,
    headers: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }).then(response => response.json());
  const result = response.status === 200 ? { data: response.data } : { error: response };
  if (result.error) {
    const responseError = result.error as ErrorResponse;
    // Show alert error
    api.dispatch(showAutohideAlert({
      ...alertConfig,
      type: AlertType.ERROR,
      titleSchema: 'alert.title.POST',
      message: responseError.message
    }));
    return result;
  }

  // Show alert success
  api.dispatch(showAutohideAlert({
    ...alertConfig,
    type: AlertType.SUCCESS,
    titleSchema: 'alert.title.POST',
  }));
  return result;
});

export type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, ErrorResponse>

const getMethod = (args: string | FetchArgs) => isObject(args) ? args.method : 'GET';

const appBaseQuery: AppBaseQuery = async (args, api, extraOptions) => {
  const alertConfig = {
    id: api.endpoint,
    static: false
  } as AlertState;

  const finalArgs = isObject(args) ? {
    ...args,
    body: args.body ? omit(args.body, 'extraProps') : undefined
  } : args;

  // Show alert loading
  api.dispatch(showAlert({
    ...alertConfig,
    type: AlertType.LOADING,
    titleSchema: `alert.title.${getMethod(finalArgs)}`,
  }));

  // For testing purposes
  // await delay(1000);

  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(finalArgs, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery({
          url: REFRESH_TOKEN_API_URL
        }, api, extraOptions);

        if (refreshResult.data) {
          // Retry the initial query
          result = await baseQuery(finalArgs, api, extraOptions);
          const refreshData = refreshResult.data as { data: { user: UserDetails } };
          api.dispatch(setUserDetails(refreshData.data.user));
        } else {
          window.location.href = routes.signout;
        }
      } finally {
        // Release must be called once the mutex should be released again.
        release();
      }
    } else {
      // Wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(finalArgs, api, extraOptions);
    }
  }

  if (result.error) {
    const responseError = result.error.data as ErrorResponse || {
      status: result.error.status,
      message: 'Could not connect to server, please check your network connection or try again later'
    } as ErrorResponse;
    // Show alert error
    api.dispatch(showAutohideAlert({
      ...alertConfig,
      type: AlertType.ERROR,
      titleSchema: `alert.title.${getMethod(finalArgs)}`,
      message: responseError.message
    }));
    return { error: responseError, meta: result.meta };
  }

  // Show alert success
  api.dispatch(showAutohideAlert({
    ...alertConfig,
    type: AlertType.SUCCESS,
    titleSchema: `alert.title.${getMethod(finalArgs)}`,
  }));
  return result;
};

export default appBaseQuery;