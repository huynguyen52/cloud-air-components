import { Box } from '@mui/material';
import AppCircularProgress from './AppCircularProgress';

const AppLoading = () => <Box
  width="100%"
  height="100%"
  position="absolute"
  top={0}
  left={0}
  sx={{ bgcolor: 'background.white' }}
  zIndex={1000}
  display="flex"
  justifyContent="center"
  alignItems="center"
>
  <AppCircularProgress />
</Box>;

export default AppLoading;