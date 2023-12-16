import { Box } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AppFooter from 'src/layouts/components/AppFooter';
import AppHeader from 'src/layouts/components/AppHeader';
import AppSideBar from 'src/layouts/components/AppSideBar';
import { DEFAULT_FOOTER_HEIGHT, DEFAULT_HEADER_HEIGHT, DEFAULT_MINI_SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH } from 'src/constants/common';
import { matchRoute, sideBarConfigs } from 'src/router/routes';
import { useAppSelector } from 'src/store/hooks';

export interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;
  const location = useLocation();
  const { t } = useTranslation();
  const sideBarOpen = useAppSelector(state => state.global.sideBarOpen);
  const sideBarHover = useAppSelector(state => state.global.sideBarHover);
  const collapsed = !sideBarOpen && !sideBarHover;

  const matchedRoute = useMemo(() => matchRoute(location.pathname), [ location ]);

  return <AppSideBar
    menuItems={sideBarConfigs}
    selectedItem={matchedRoute?.config}
  >
    <AppHeader title={t(matchedRoute?.config.title || 'common.untitled')} />
    <Box
      sx={{
        px: 4,
        py: 3,
        overflowY: 'auto'
      }}
      width={`calc(100vw - ${collapsed ? DEFAULT_MINI_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH})`}
      height={`calc(100vh - ${DEFAULT_HEADER_HEIGHT} - ${DEFAULT_FOOTER_HEIGHT})`}
      position="relative"
    >
      {children}
    </Box>
    <AppFooter />
  </AppSideBar>;
};

export default AppLayout;