import { Box, Stack, Typography } from '@mui/material';
import { MenuItem, SubMenu } from 'react-pro-sidebar';
import { ReactComponent as DotOutlineIcon } from 'src/assets/icons/icon-dot-outline.svg';
import { ReactComponent as NavigateLeftIcon } from 'src/assets/icons/icon-navigate-left-white.svg';
import { ReactComponent as NavigateDownIcon } from 'src/assets/icons/icon-navigate-down-white.svg';
import { t } from 'i18next';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setSideBarCollapse } from 'src/store/reducer';
import { RouteConfig } from 'src/utils/routerUtils';

export interface SubMenuItemProps {
  title?: string;
  code: string;
  childrenConfigs: RouteConfig[];
  selectedItem?: RouteConfig;
  handleClickItem: (item: RouteConfig) => void;
  icon?: JSX.Element;
}

const SubMenuItem = (props: SubMenuItemProps) => {
  const { title, code, childrenConfigs, selectedItem, handleClickItem, icon } = props;
  const dispatch = useAppDispatch();
  const sideBarCollapse = useAppSelector(state => state.global.sideBarCollapse);
  const open = sideBarCollapse[code];
  const setOpen = (isOpen: boolean) => dispatch(setSideBarCollapse({ code, isOpen }));
  return (<SubMenu
    label={<Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ pr: 1.5 }}
    >
      <Typography
        variant="subtitle3"
        marginRight={0.75}
        component="span"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {t(title || 'common.untitled')}
      </Typography>

      {open ? <NavigateDownIcon /> : <NavigateLeftIcon />}
    </Box>}
    icon={icon}
    onClick={event => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!open);
    }}
    open={open}
    active={childrenConfigs.find(item => item.code === selectedItem?.code) !== undefined}
  >
    {childrenConfigs.map(childConfig => {
      const { code, title } = childConfig;
      return (<MenuItem
        key={code}
        onClick={() => handleClickItem(childConfig)}
        active={code === selectedItem?.code}
      >
        <Stack direction="row" marginLeft={2}>
          <Box display="flex" alignItems="center"><DotOutlineIcon width={8} height={8} /></Box>
          <Typography
            variant="body1"
            marginLeft={0.75}
            component="span"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {t(title || 'common.untitled')}
          </Typography>
        </Stack>
      </MenuItem>);
    })}
  </SubMenu>);
};

export default SubMenuItem;