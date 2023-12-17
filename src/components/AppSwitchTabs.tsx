import { Box, SxProps, Tab, Tabs, Theme, Typography, styled, useTheme } from '@mui/material';
import { ReactNode, SyntheticEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';

export interface AppSwitchTabsProps {
  children?: ReactNode;
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
}

export const AppSwitchTabs = styled((props: AppSwitchTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({

});

interface AppTabProps {
  label: string;
}

export const AppTab = styled((props: AppTabProps) => (
  <Tab disableRipple {...props} />
))(() => ({

}));

interface AppTabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

export const AppTabPanel = (props: AppTabPanelProps) => {
  const { children, value, index, sx, ...other } = props;
  const theme = useTheme();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      dir={theme.direction}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, ...sx }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export interface AppSwipeableViewsProps {
  index: number;
  onChangeIndex: (index: number) => void;
  children: ReactNode;
}

export const AppSwipeableViews = (props: AppSwipeableViewsProps) => {
  const { index, onChangeIndex, children } = props;
  const theme = useTheme();
  return (
    <SwipeableViews
      index={index}
      onChangeIndex={onChangeIndex}
      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
    >
      {children}
    </SwipeableViews>
  );
};
