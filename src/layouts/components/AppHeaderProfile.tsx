import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useAppSelector } from 'src/store/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from 'src/router/routes';
import { ReactComponent as UserAvatar } from 'src/assets/images/user-avatar.svg';
import { ReactComponent as ArrowDownIcon } from 'src/assets/icons/icon-arrow-down.svg';

const AppHeaderProfile = () => {
  const user = useAppSelector(state => state.global.user);
  const navigate = useNavigate();

  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    navigate(routes.signout);
  };

  return (<Stack direction="row" alignItems="center" >
    <UserAvatar />
    <Typography variant="subtitle3" sx={{ display: 'flex', alignItems: 'center', ml: 0.75 }}>
      {user?.fullName}
    </Typography>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
      sx={{ p: 0.75 }}
    >
      <ArrowDownIcon />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{ mt: 5 }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
    </Menu>
  </Stack>);
};

export default AppHeaderProfile;