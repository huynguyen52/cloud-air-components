import { ReactComponent as DashboardIcon } from 'src/assets/icons/icon-dashboard-outline.svg';
import { ReactComponent as CourseIcon } from 'src/assets/icons/icon-course-menu-outline.svg';
import { ReactComponent as UserIcon } from 'src/assets/icons/icon-user-menu-outline.svg';
import { ReactComponent as WorkflowIcon } from 'src/assets/icons/icon-workflow-menu-outline.svg';
import { ReactComponent as AdminIcon } from 'src/assets/icons/icon-admin-menu-outline.svg';
import {
  RouteConfig,
  RouteMatch,
  filterPath,
  filterRouteConfigs,
  findFirstAvailablePath,
  getRoutesFromConfigs,
  getSideBarConfigs,
  matchRouteRecursive,
  openSideBarCollapseRecursive,
  renderRoutes
} from '../utils/routerUtils';

export const routeConfigs: { [key: string]: RouteConfig[] } = {
  private: [
    {
      code: 'homepage',
      path: '/',
      index: true,
      title: 'sideBar.homepage',
      icon: <DashboardIcon />,
      onSideBar: true
    },
    {
      code: 'courses',
      path: '/course',
      title: 'sideBar.courses',
      icon: <CourseIcon />,
      onSideBar: true,
      module: 'PROCESS_COURSE'
    },
    {
      code: 'admin',
      path: '/admin',
      title: 'sideBar.admins',
      icon: <AdminIcon />,
      onSideBar: true,
    },
    {
      code: 'courseDetail',
      path: '/course/:resource',
      title: 'sideBar.courseDetail',
      module: 'PROCESS_COURSE'
    },
    {
      code: 'trainer',
      path: '/trainer',
      title: 'sideBar.trainerManagement',
      icon: <CourseIcon />,
      onSideBar: true,
    },
    {
      code: 'management',
      title: 'sideBar.management',
      icon: <UserIcon />,
      onSideBar: true,
      children: [
        {
          code: 'users',
          path: '/management/user',
          title: 'sideBar.users',
          index: true,
          onSideBar: true,
        },
        {
          code: 'roles',
          path: '/management/role',
          title: 'sideBar.roles',
          onSideBar: true,
        },
        {
          code: 'permissions',
          path: '/management/permission',
          title: 'sideBar.permissions',
          onSideBar: true,
        },
        {
          code: 'courseTypes',
          path: '/management/coursetype',
          title: 'sideBar.courseTypes',
          onSideBar: true,
        }
      ]
    },
    {
      code: 'workflowManagement',
      title: 'sideBar.workflowManagement',
      icon: <WorkflowIcon />,
      onSideBar: true,
      children: [
        {
          code: 'workflows',
          path: '/workflow-management/workflow',
          title: 'sideBar.workflows',
          index: true,
          onSideBar: true,
        },
      ]
    },
    // Insert more private routes before this comment
  ],
  public: [
    {
      code: 'signin',
      path: '/signin',
    },
    {
      code: 'signout',
      path: '/signout',
    },
    {
      code: 'unauthorized',
      path: '/unauthorized',
    },
    // Insert more public routes before this comment
  ]
};

export const matchRoute = (path: string): RouteMatch | undefined => Object.values(routeConfigs).reduce((result, configs) => !result ? matchRouteRecursive(configs, path): result, undefined as (RouteMatch | undefined));

export const sideBarConfigs = getSideBarConfigs(routeConfigs.private);

export const findAllSideBarCollapsesToPath = (path: string) => openSideBarCollapseRecursive(sideBarConfigs, path);

export type {
  RouteConfig,
  RouteMatch,
};

export {
  renderRoutes,
  filterPath,
  filterRouteConfigs,
  findFirstAvailablePath
};

const routes = getRoutesFromConfigs(routeConfigs);
export default routes;