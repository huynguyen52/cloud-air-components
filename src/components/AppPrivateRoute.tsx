import { useCookies } from 'react-cookie';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AppFullScreenLoader from './AppGlobalLoading';
import { useGetCurrentUserQuery } from 'src/api/userApi';
import AppLayout from 'src/layouts/AppLayout';
import routes, { filterPath } from 'src/router/routes';

const AppPrivateRoute = () => {
  const [ cookies ] = useCookies([ 'signed_in' ]);
  const location = useLocation();
  const { isLoading, isFetching, data: user } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || isFetching) {
    return <AppFullScreenLoader />;
  }

  return ((cookies.signed_in || user) && filterPath(location.pathname, user?.permissions || [])) ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : cookies.signed_in && user ? (
    <Navigate to={routes.unauthorized} state={{ from: location }} replace />
  ) : (
    <Navigate to={routes.signin} state={{ from: location }} replace />
  );
};

export default AppPrivateRoute;

