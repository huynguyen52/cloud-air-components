import { Reducer, configureStore } from '@reduxjs/toolkit';
import globalReducer, { GlobalState } from './reducer';
import tableReducer, { TableState } from 'src/components/AppDataTable/reducer';
import confirmReducer, { ConfirmState } from 'src/components/AppConfirm/reducer';
import alertReducer, { AlertPoolState } from 'src/components/AppAlert/reducer';
import notificationCenterReducer, { NotificationCenterState } from 'src/layouts/components/NotificationCenter/reducer';
import { authApi } from 'src/api/authApi';
import { userApi } from 'src/api/userApi';
import { permissionApi } from 'src/api/permissionApi';
import { roleApi } from 'src/api/roleApi';
import { masterDataApi } from 'src/api/masterDataApi';
import { enableMapSet } from 'immer';
import { notificationApi } from 'src/api/notificationApi';
import { workflowApi } from 'src/api/workflowApi';
import { moduleApi } from 'src/api/moduleApi';
import { workApi } from 'src/api/workApi';
import { courseApi } from 'src/api/courseApi';
import { workflowProgressApi } from 'src/api/workflowProgressApi';
import { courseTypeApi } from 'src/api/courseTypeApi';
import { nodeApi } from 'src/api/nodeApi';
import { programApi } from 'src/api/programApi';
import { aolExamApi } from 'src/api/aolExamApi';
import { locationApi } from 'src/api/locationApi';
import { courseParticipantApi } from 'src/api/courseParticipantApi';
import { uploadMofResultApi } from 'src/api/uploadMofResultApi';
import { trainerApi } from 'src/api/trainerApi';
enableMapSet();

export const store = configureStore({
  reducer: {
    global: globalReducer as Reducer<GlobalState>,
    table: tableReducer as Reducer<TableState>,
    confirm: confirmReducer as Reducer<ConfirmState>,
    alert: alertReducer as Reducer<AlertPoolState>,
    notificationCenter: notificationCenterReducer as Reducer<NotificationCenterState>,
    // Insert more reducer before this comment

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [masterDataApi.reducerPath]: masterDataApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [moduleApi.reducerPath]: moduleApi.reducer,
    [workApi.reducerPath]: workApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [workflowProgressApi.reducerPath]: workflowProgressApi.reducer,
    [courseTypeApi.reducerPath]: courseTypeApi.reducer,
    [nodeApi.reducerPath]: nodeApi.reducer,
    [programApi.reducerPath]: programApi.reducer,
    [aolExamApi.reducerPath]: aolExamApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [courseParticipantApi.reducerPath]: courseParticipantApi.reducer,
    [uploadMofResultApi.reducerPath]: uploadMofResultApi.reducer,
    [trainerApi.reducerPath]: trainerApi.reducer,
    // Insert more api reducer before this comment
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat(
      authApi.middleware,
      userApi.middleware,
      permissionApi.middleware,
      roleApi.middleware,
      masterDataApi.middleware,
      notificationApi.middleware,
      workflowApi.middleware,
      moduleApi.middleware,
      workApi.middleware,
      courseApi.middleware,
      workflowProgressApi.middleware,
      courseTypeApi.middleware,
      nodeApi.middleware,
      programApi.middleware,
      aolExamApi.middleware,
      locationApi.middleware,
      courseParticipantApi.middleware,
      uploadMofResultApi.middleware,
      trainerApi.middleware
      // Insert more api middleware before this comment
    )
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch