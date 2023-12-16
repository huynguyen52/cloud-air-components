import _, { isArray } from 'lodash';
import { PathMatch, RouteObject, matchPath } from 'react-router-dom';
import Permission from 'src/types/Permission';
import Module from 'src/types/Module';
import { PermissionAction } from 'src/constants/permissions';

export interface RouteConfig {
  code: string;
  path?: string;
  module?: string;
  title?: string;
  icon?: JSX.Element;
  index?: boolean;
  onSideBar?: boolean;
  children?: RouteConfig[];
}

export interface RouteMatch extends PathMatch<string> {
  config: RouteConfig;
}

const getRoutesFromConfigsRecursive = (configs: RouteConfig[]): {[key: string]: string } => {
  const result = {} as {[key: string]: string };
  configs.forEach(config => {
    if (config.path) {
      result[config.code] = config.path;
    }
    if (config.children) {
      Object.entries(getRoutesFromConfigsRecursive(config.children))
        .forEach(([ subName, subPath ]) => {
          result[subName] = subPath;
        });
    }
  });
  return result;
};

export const getRoutesFromConfigs = (routeConfigs: { [key: string]: RouteConfig[] }) => {
  const result = {} as {[key: string]: string };
  Object.entries(getRoutesFromConfigsRecursive(routeConfigs.public))
    .forEach(([ name, path ]) => {
      result[name] = path;
    });
  Object.entries(getRoutesFromConfigsRecursive(routeConfigs.private))
    .forEach(([ name, path ]) => {
      result[name] = path;
    });
  return result;
};

export const getSideBarConfigs = (configs: RouteConfig[]) => {
  const result: RouteConfig[] = [];
  configs.forEach(config => {
    if (config.onSideBar) {
      if (!config.children) {
        result.push(config);
      } else {
        const children = getSideBarConfigs(config.children);
        const newConfig = _.clone(config);
        newConfig.children = children;
        result.push(newConfig);
      }
    }
  });
  return result;
};

export const matchRouteRecursive = (configs: RouteConfig[], path: string): RouteMatch | undefined => {
  let result: RouteMatch | undefined = undefined;
  configs.forEach(config => {
    const matched = config.path ? matchPath({
      path: config.path,
      caseSensitive: true,
      end: true,
    }, path) : undefined;
    if (matched) {
      result = result || {
        ...matched,
        config
      };
    } else if (config.children) {
      result = result || matchRouteRecursive(config.children, path);
    }
  });
  return result;
};

export const openSideBarCollapseRecursive = (configs: RouteConfig[], path: string): string[] | undefined => {
  let result: string[] | undefined = undefined;
  configs.forEach(config => {
    if (result) {
      return;
    }
    const matched = config.path ? matchPath({
      path: config.path,
      caseSensitive: true,
      end: true,
    }, path) : undefined;
    if (matched) {
      result = [];
      return;
    } else if (config.children) {
      result = openSideBarCollapseRecursive(config.children, path);
      if (isArray(result)) {
        result.push(config.code);
        return;
      }
    }
  });
  return result;
};

export const filterPath = (path: string, permissions: Permission[]) =>
  permissions && permissions.filter(permission =>
    permission.action === PermissionAction.VIEW && (new RegExp(`^${permission.resource}$`).test(path))).length > 0;

export const filterModule = (path: string, modules: Module[]) =>
  modules && modules.filter(module => module.code === path).length > 0;

export const filterRouteConfigs = (routeConfigs: RouteConfig[], permissions: Permission[], modules: Module[]): RouteConfig[] => routeConfigs.filter(config => {
  const pathVisible = config.path ? filterPath(config.path, permissions) : true;
  const moduleVisible = config.module ? filterModule(config.module, modules) : true;
  if (pathVisible && config.children) {
    config.children = filterRouteConfigs(config.children, permissions, modules);
  }
  if (!config.path && !config.children?.length) return false;
  return pathVisible && moduleVisible;
});

export const findFirstAvailablePath = (config: RouteConfig): string | undefined => {
  if (config.path) {
    return config.path;
  }
  if (config.children && config.children.length) {
    const indexChild = config.children.find(item => item.index);
    return indexChild ? findFirstAvailablePath(indexChild) : undefined;
  }
};

export const renderRoutes = (routeViews: { [key: string]: JSX.Element }, routeConfigs: RouteConfig[]): RouteObject[] => {
  const result: RouteObject[] = [];
  routeConfigs.forEach(config => {
    if (!config.children) {
      result.push({
        path: config.path,
        element: routeViews[config.code],
        index: config.index
      });
    } else {
      const children = renderRoutes(routeViews, config.children);
      result.push({
        path: config.path,
        element: routeViews[config.code],
        children
      });
    }
  });
  return result;
};

export const prepareVariableRoutePath = (path: string, variables: { [key: string]: (string | number) }) =>
  Object.entries(variables).reduce((result, [ key, value ]) => result.replace(`:${key}`, value.toString()), path);
