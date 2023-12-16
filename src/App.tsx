import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import defaultTheme from './themes/default';
import { useCookies } from 'react-cookie';
import { useGetCurrentUserQuery } from './api/userApi';
import AppFullScreenLoader from './components/AppGlobalLoading';

const App = () => {
  const [ cookies ] = useCookies([ 'signed_in' ]);

  const { isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !cookies.signed_in
  });

  return <ThemeProvider theme={defaultTheme}>
    <CssBaseline enableColorScheme />
    {isLoading ? <AppFullScreenLoader /> : <RouterProvider router={router} />}
  </ThemeProvider>;
};

export default App;
