import {
  Typography,
  Stack,
  useTheme
} from '@mui/material';
import AppHeaderProfile from './AppHeaderProfile';
import NotificationCenter from './NotificationCenter';
import { ReactComponent as HomepageOutlineIcon } from 'src/assets/icons/icon-homepage-outline.svg';
import { ReactComponent as NavigateIcon } from 'src/assets/icons/icon-navigate.svg';
import { Link } from 'react-router-dom';
import routes from 'src/router/routes';
import { DEFAULT_HEADER_HEIGHT } from 'src/constants/common';

export interface AppHeaderProps {
  title: string;
}

const AppHeader = (props: AppHeaderProps) => {
  const { title } = props;
  const theme = useTheme();

  return (<Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{
      ml: 4,
      p: 2,
      bgcolor: 'background.paper',
      height: DEFAULT_HEADER_HEIGHT,
      borderRadius: theme.typography.pxToRem(12),
      boxShadow: '0px 2px 6px 0px rgba(71, 85, 105, 0.10)'
    }}
  >
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{
        a: {
          display: 'inline-flex',
          alignItems: 'center',
        }
      }}
    >
      <Link to={routes.homepage}>
        <HomepageOutlineIcon />
      </Link>
      <NavigateIcon />
      <Typography variant="body2" color="primary">{title}</Typography>
    </Stack>
    <Stack direction="row" gap={2}>
      <NotificationCenter />
      <AppHeaderProfile />
    </Stack>
  </Stack>);
};

export default AppHeader;