import { Grid } from '@mui/material';
import { AppCircularProgress } from './AppCircularProgress';

export const AppGlobalLoading = () => <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center"
  sx={{ minHeight: '100vh' }}
>
  <AppCircularProgress />
</Grid>;
