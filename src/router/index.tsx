import { createBrowserRouter } from 'react-router-dom';
import { AppPrivateRoute } from 'src/components/AppPrivateRoute';
import { renderRoutes, routeConfigs } from './routes';

const routeViews: { [key: string]: JSX.Element } = {
  // Insert more views before this comment
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppPrivateRoute />,
    children: renderRoutes(routeViews, routeConfigs.private),
  },
  ...renderRoutes(routeViews, routeConfigs.public),
]);

export default router;
