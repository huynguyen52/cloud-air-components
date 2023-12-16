# lms-ui

# Project base rules:

## 1. View components:
  - Each view component is to display one page matched with one route path
  - View components will be placed in <code>src/views</code>
  - View component's file extension must be <code>.tsx</code>
  - View component files should be named with the name in pascal case, Ex: ThisView.tsx
  - View component may come with multiple sub-views, local components or even reducer, place all of them under a single folder with name in pascal case, Ex:
    - ThisView
      - components
        - LocalComponent1.tsx
        - LocalComponent2.tsx
      - reducer.ts
      - SubView1.tsx
      - SubView2.tsx
  - View component must have export default
  - View Component props should be defined as 'interface' and allways visible from outside scope (must export the props interface)

## 2. Components:
  - Each component is to display one part of a page (View) and can be reused in multiple View components
  - Components will be placed in <code>src/components</code>
  - Component's file extension must be <code>.tsx</code>
  - Component files should be named with the name in pascal case and start with "App", Ex: AppDataTable.tsx
  - Component may come with multiple local components, styles or even reducer, place all of them under a single folder with name in pascal case, local components' file name is not start with "App", <code>index.tsx</code> is required under component folder, Ex:
    - AppDataTable
      - components
        - LocalComponent1.tsx
        - LocalComponent2.tsx
      - reducer.ts
      - styles.ts
      - index.tsx  <--- this file is required
  - Component props should be defined as 'interface' and allways visible from outside scope (must export the props interface)

## 3. Reducers
  - Reducers will be placed under view component folders
  - Reducers allways comes with the name <code>reducer.ts</code>, they are different from each other by the scope they are placed under
  - The global reducer (<code>src/store/reducer.ts</code>) is a special reducer that hold all of global state like: UI version, theme, default language, current user login,...
  - All reducers must be registered with store at <code>src/store/index.ts</code> before the comment <code>// Insert more reducer before this comment</code>
  - Reducer's file must have export default <code>slide.reducer</code> and export all their actions from <code>slide.actions</code>

## 4. API Calls
  - All API calls are made by RTKQuery
  - All APIs related to one model should be placed in a single api file
  - All API files are placed under <code>src/api</code>
  - API file name should start with model name and and with the suffix "Api". Ex: permissionApi.ts
  - API reducers and middlewares must be registered with store at <code>src/store/index.ts</code>
    - new API reducers should be placed before the comment <code>// Insert more api reducer before this comment</code>
    - new API middlewares should be placed before the comment <code>// Insert more api middleware before this comment</code>

## 5. Router
  - To navigate between page, routes need to be configured
  - Step to add a route:
    - Add new route configuration to <code>src/router/routes.tsx</code> under scope of <code>routeConfigs</code> declaration, new route configuration must be associated with a unique code
    - Add new route-view mapping to <code>src/router/index.tsx</code> under scope of <code>routeViews</code> before the comment <code>// Insert more views before this comment</code>, the key here is matched with route configuration code, and the value is a JSXElement
  - Details about RouteConfig:
  ``` typescript
    export interface RouteConfig {
      code: string; // <-- Unique code of route configuration
      path?: string; // <-- Path use to route, this is a full path. Ex: /management/permissions
      title?: string; // <-- Title use to show on header bar
      onSideBar?: boolean; // <-- If true, this view will show on the global side bar
      icon?: JSX.Element; // <-- Icon in sidebar if onSideBar is true
      index?: boolean; // <-- If true, this route will be show as default when its parent is not available to route
      children?: RouteConfig[]; // <-- Sub route configs
    }
  ```
  - How to navigate manually with <code>routes</code>:
  ``` typescript
    // RouteConfig
    {
      code: 'signout', // <-- route config code
      path: '/signout',
    },

    ...
    import { useNavigate } from 'react-router-dom';
    import routes from 'src/router/routes';
    const navigate = useNavigate();
    const eventHandler = () => {
      navigate(routes.signout); // <-- "signout" is the unique code defined in RouteConfig
    }
  ```
