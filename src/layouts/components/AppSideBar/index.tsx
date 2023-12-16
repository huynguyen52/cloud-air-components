import {
  Box, Typography
} from '@mui/material';
import { DEFAULT_MINI_SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH } from 'src/constants/common';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { hideSideBar, hoverLeaveSideBar, hoverSideBar, setSideBarCollapses, showSideBar } from 'src/store/reducer';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect, useMemo } from 'react';
import { findAllSideBarCollapsesToPath, RouteConfig, filterRouteConfigs, findFirstAvailablePath } from 'src/router/routes';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { ReactComponent as LogoSmall } from 'src/assets/icons/icon-logo-small.svg';
import useSideBarStyles from './styles';
import SubMenuItem from './components/SubMenuItem';

export interface AppSideBarProps {
  menuItems: RouteConfig[];
  selectedItem?: RouteConfig;
  children: ReactNode;
}
const AppSideBar = (props: AppSideBarProps) => {
  const { menuItems, selectedItem, children } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.global.user);
  const sideBarOpen = useAppSelector(state => state.global.sideBarOpen);
  const sideBarHover = useAppSelector(state => state.global.sideBarHover);
  const collapsed = !sideBarOpen && !sideBarHover;

  const handleSideBarOpen = () => {
    dispatch(showSideBar());
  };

  const handleSideBarClose = () => {
    dispatch(hideSideBar());
  };

  const handleMouseEnter = () => {
    dispatch(hoverSideBar());
  };

  const handleMouseLeave = () => {
    dispatch(hoverLeaveSideBar());
  };

  const handleClickItem = (config: RouteConfig) => {
    const navigatePath = findFirstAvailablePath(config);
    if (navigatePath) {
      navigatePath != config.path && autoOpenCollapses(navigatePath);
      handleSideBarClose();
    }

    return navigatePath ? navigate(navigatePath) : undefined;
  };

  const filterItems = useMemo(() => user ?
    filterRouteConfigs(menuItems, user.permissions, user.modules): menuItems,
  [ user ]);

  const autoOpenCollapses = (path: string) => {
    const collapseCodes = findAllSideBarCollapsesToPath(path);
    if (collapseCodes) {
      dispatch(setSideBarCollapses({ codes: collapseCodes, isOpen: true }));
    }
  };

  useEffect(() => {
    if (selectedItem?.path) {
      autoOpenCollapses(selectedItem.path);
    }
  }, []);

  const renderItems = (configs: RouteConfig[]) => configs.map(config => {
    const { code, icon, title, children } = config;
    return (children && children.length > 0 ?  <SubMenuItem
      title={title}
      code={code}
      childrenConfigs={children}
      selectedItem={selectedItem}
      handleClickItem={handleClickItem}
      icon={icon}
    /> :
      <MenuItem
        icon={icon}
        onClick={() => handleClickItem(config)}
        active={code === selectedItem?.code}
      >
        <Typography variant="subtitle3">{t(title || 'common.untitled')}</Typography>
      </MenuItem>);
  });

  const sidebarItems = useMemo(() => renderItems(filterItems), [ selectedItem ]);

  return (<Box display="flex" height="100vh">
    <Sidebar
      className="app"
      collapsed={collapsed}
      width={DEFAULT_SIDEBAR_WIDTH}
      collapsedWidth={DEFAULT_MINI_SIDEBAR_WIDTH}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      rootStyles={useSideBarStyles()}
    >
      <Menu>
        <MenuItem
          className="logo"
          icon={<Box
            sx={{ p: 1, bgcolor: 'background.paper', borderRadius: '0.375rem' }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={sideBarOpen ? handleSideBarClose : handleSideBarOpen}
          >
            <LogoSmall width={42} height={42} />
          </Box>}
        >
          <Typography variant="subtitle2" paddingX={1} marginTop={3}>{t('common.lms')}</Typography>
        </MenuItem>
        {sidebarItems}
      </Menu>
    </Sidebar>
    <Box display="flex" flexDirection="column" width="100%">
      {children}
    </Box>
  </Box>);
};

export default AppSideBar;