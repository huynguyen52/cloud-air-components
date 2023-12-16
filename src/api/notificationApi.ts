import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appBaseQuery from './appBaseQuery';
import { COUNT_UNREAD_NOTIFICATION_API_URL, READ_NOTIFICATION_API_URL, SEARCH_NOTIFICATION_API_URL } from 'src/constants/apiEndpoints';
import { SearchRequest } from 'src/types/Request';
import { Response, SearchResponse } from 'src/types/Response';
import Notification from 'src/types/Notification';
import { preparePathVariablesUrl } from 'src/utils/apiUtils';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: appBaseQuery,
  tagTypes: [ 'NotificationCount' ],
  endpoints: builder => ({
    searchNotifications: builder.query<Notification[], SearchRequest>({
      query: args => ({
        method: 'POST',
        url: SEARCH_NOTIFICATION_API_URL,
        body: args || {}
      }),
      transformResponse: (result: SearchResponse<Notification>) => result.data,
    }),
    countUnreadNotifications: builder.query<number, void>({
      query: () => COUNT_UNREAD_NOTIFICATION_API_URL,
      transformResponse: (result: Response<number>) => result.data,
      providesTags: [ 'NotificationCount' ]
    }),
    readNotification: builder.mutation<Notification, number>({
      query: notificationId => ({
        method: 'PUT',
        url: preparePathVariablesUrl(READ_NOTIFICATION_API_URL, { notificationId })
      }),
      transformResponse: (result: Response<Notification>) => result.data,
      invalidatesTags: [ 'NotificationCount' ]
    })
  })
});

export const {
  useLazySearchNotificationsQuery,
  useCountUnreadNotificationsQuery,
  useReadNotificationMutation
} = notificationApi;