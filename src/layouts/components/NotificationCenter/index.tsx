import { Badge, Box, IconButton, Link as MuiLink, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Popover, Typography, useTheme } from '@mui/material';
import { UIEventHandler, useEffect, useMemo, useState } from 'react';
import { NOTIFICATION_CENTER_HEIGHT, NOTIFICATION_CENTER_WIDTH } from 'src/constants/common';
import { AppSwitch } from 'src/components/AppSwitch';
import { useTranslation } from 'react-i18next';
import { clone, entries, groupBy, noop, unionBy } from 'lodash';
import Notification from 'src/types/Notification';
import { formatISODate, formatTimeAgo } from 'src/utils/dateTimeUtils';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import { notificationApi, useCountUnreadNotificationsQuery, useLazySearchNotificationsQuery, useReadNotificationMutation } from 'src/api/notificationApi';
import { AppCircularProgress } from 'src/components/AppCircularProgress';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { BASE_STREAM_URL, PRIVATE_NOTIFICATION_STREAM_URL } from 'src/constants/apiEndpoints';
import { SocketResponse } from 'src/types/Response';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { AlertType } from 'src/constants/enums';
import { showAutohideAlert } from 'src/components/AppAlert/reducer';
import { defaultFilter, prependData, setData, setFilter, setOpen } from './reducer';
import { AppAlert } from '../../../components/AppAlert';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { ReactComponent as NotificationIcon } from 'src/assets/icons/icon-notification-outline.svg';
import moment from 'moment';

const prepareNotificationData = (data: Notification[]) => groupBy(data, (notification: Notification) => {
  const createDate = moment(notification.createdDate);
  const current = moment();
  if (createDate.isSame(current, 'date')) {
    return 'notification.today';
  }
  if (createDate.isSame(current.subtract(1, 'day'), 'date')) {
    return 'notification.yesterday';
  }
  return formatISODate(notification.createdDate);
});

const notificationIconMap = {
  success: CheckCircleOutlineIcon,
  warning: WarningAmberIcon,
  error: ErrorOutlineIcon,
  info: InfoIcon,
  default: InfoIcon
} as {[key: string]: typeof CheckCircleOutlineIcon};

const NotificationCenter = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useAppSelector(state => state.global.user);
  const filter = useAppSelector(state => state.notificationCenter.filter);
  const data = useAppSelector(state => state.notificationCenter.data);
  const [ fetchNotifications, { data: searchResult, isFetching } ] = useLazySearchNotificationsQuery();
  const { data: unreadCount } = useCountUnreadNotificationsQuery();
  const [ readNotification, { data: readResult } ] = useReadNotificationMutation();
  const { closeSnackbar } = useSnackbar();
  const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

  const notificationData = useMemo(() => prepareNotificationData(data), [ data ]);

  useEffect(() => {
    fetchNotifications(filter);
    return handleOpenSocket();
  }, []);

  useEffect(() => {
    dispatch(setOpen(Boolean(anchorEl)));
  }, [ anchorEl ]);

  useEffect(() => {
    if (searchResult?.length) {
      // Merge new results to current data
      dispatch(setData(unionBy(searchResult, data, 'id')));
      dispatch(setFilter({ ...filter, page: filter.page + 1 }));
    }
  }, [ searchResult ]);

  useEffect(() => {
    if (readResult) {
      // Replace the read notification from data with the new updated one
      const newData = clone(data);
      newData[data.findIndex(item => item.id === readResult.id)] = readResult;
      dispatch(setData(newData));
    }
  }, [ readResult ]);

  const handleScroll: UIEventHandler<HTMLUListElement>  = event => {
    const target = event.target as HTMLInputElement;
    const scrollBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1;
    if (scrollBottom && !isFetching) {
      fetchNotifications(filter);
    }
  };

  const handleOpenSocket = () => {
    try {
      const socket = new SockJS(BASE_STREAM_URL);
      const client = Stomp.over(socket);

      client.connect({}, () => {
        client.subscribe(PRIVATE_NOTIFICATION_STREAM_URL, message => {
          const received = JSON.parse(message.body) as SocketResponse<Notification>;
          if (received.metadata.to?.id === user?.id) {
            handleNewNotification(received.data);
          }
        });
      });

      return () => {
        if (socket) {
          socket.close();
        }
      };
    } catch {
      // Do nothing
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReadNotification = (notification: Notification) => {
    readNotification(notification.id);
  };

  const handleUnreadOnly = (checked: boolean) => {
    dispatch(setData([]));
    const newFilter = { ...defaultFilter, filter: { unreadOnly: checked } };
    dispatch(setFilter(newFilter));
    fetchNotifications(newFilter);
  };

  const handleNewNotification = useMemo(() => (notification: Notification) => {
    dispatch(prependData(notification));
    dispatch(showAutohideAlert({
      id: `NOTIFICATIONS${notification.id}`,
      static: false,
      type: (notification.type.config?.variant || 'info') as AlertType,
      title: notification.type.name,
      message: renderNotificationBody(notification)
    }));
    dispatch({
      type: `${notificationApi.reducerPath}/invalidateTags`,
      payload: [ 'NotificationCount' ],
    });
  }, [ data ]);

  const renderNotificationBody = (notification: Notification) => {
    const variant = notification.type.config?.variant;
    const linkColor = variant && !notification.read ? `${variant}.main` : 'text.link';
    return <>
      <Typography
        sx={{ display: 'inline' }}
        component="span"
        variant="body2"
        color="text.primary"
      >
        {notification.message}
      </Typography>
      {` - ${notification.createdBy || ''} ${formatTimeAgo(notification.createdDate, i18n.language)}`}
      {notification.url && <Typography
        sx={{
          display: 'block',
          textAlign: 'right',
          '& a': { color: linkColor, textDecoration: 'none' },
          mt: 1
        }}
        component={Box}
        variant="body2"
        fontWeight={500}
        color={linkColor}
      >
        <MuiLink
          sx={{ cursor: 'pointer' }}
          onClick={event => {
            event.stopPropagation();
            handleClose();
            handleReadNotification(notification);
            closeSnackbar(`NOTIFICATIONS${notification.id}.${variant || 'info'}`);
            navigate(notification.url);
          }}
        >
          {t('notification.view')}
        </MuiLink>
      </Typography>}
    </>;
  };

  return (<>
    <AppAlert ids={[ 'NOTIFICATIONS\\d+' ]} />
    <Badge
      badgeContent={unreadCount}
      color="error"
      sx={{
        '& .MuiBadge-badge': {
          minWidth: 16,
          width: 16,
          height: 16,
          right: 8,
          top: 8,
        },
      }}
    >
      <IconButton
        size="large"
        aria-label="notification"
        color="inherit"
        sx={{ p: 0.75, bgcolor: 'cloud.success', ':hover': { bgcolor: 'cloud.success' } }}
        onClick={handleClick}
      >
        <NotificationIcon />
      </IconButton>
    </Badge>
    {/* </IconButton> */}
    <Popover
      sx = {{ mt: 1 }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
    >
      <Box width={NOTIFICATION_CENTER_WIDTH} height={NOTIFICATION_CENTER_HEIGHT}>
        <Box
          component="div"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ px:2, py:1, backgroundColor: 'primary.main' }}
        >
          <Typography
            variant="h6"
            component="div"
            color="common.white"
          >
            {t('notification.notificationCenter')}
          </Typography>
          <Box display="flex" flexDirection="row">
            <AppSwitch
              id="read"
              name="read"
              label={t('notification.showUnreadOnly')}
              defaultValue={filter.filter?.unreadOnly || false}
              color="secondary"
              setFieldValue={(_, checked) => handleUnreadOnly(checked as boolean)}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: 'common.white'
                }
              }}
            />
          </Box>
        </Box>
        <List
          sx={{
            width: '100%',
            height: 'calc(100% - 54px)',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
          onScroll={handleScroll}
        >
          {!data.length && !isFetching && <Box
            width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
            <Typography
              component="span"
              color="text.primary"
            >
              {t('notification.empty')}
            </Typography>
          </Box>}
          {!data.length && isFetching ? <AppCircularProgress sx={{ position: 'absolute', top: 'calc(50% - 20px)', left: 'calc(50% - 20px)' }} /> :
            entries(notificationData).map(([ date, notifications ]) => <li key={`section-${date}`}>
              <ul>
                <ListSubheader
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'common.white'
                  }}
                ><Typography variant="subtitle3">{t(date)}</Typography></ListSubheader>
                {notifications.map(notification => {
                  const variant = notification.type.config?.variant;
                  const Icon = notificationIconMap[variant || 'default'];
                  const color = variant && !notification.read ? `${variant}.main` : 'text.primary';
                  const bgColor = variant && !notification.read ? `cloud.${variant}` : 'background.paper';

                  return (
                    <ListItem key={`item-${date}-${notification}`}
                      sx={{
                        py: 0,
                        my: 1,
                        cursor: !notification.read ? 'pointer' : 'inherit',
                        bgcolor: bgColor,
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                        },
                        color,
                      }}
                      onClick={!notification.read ? () => handleReadNotification(notification) : noop}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.type.name}
                        secondary={renderNotificationBody(notification)}
                      />
                    </ListItem>
                  );
                })}
              </ul>
            </li>)}
          {isFetching && data.length > 0 && <Box component="li" display="flex" justifyContent="center" sx={{ p:1 }}>
            <AppCircularProgress size={theme.typography.pxToRem(16)} />
          </Box>}

        </List>
      </Box>
    </Popover>
  </>);
};

export default NotificationCenter;