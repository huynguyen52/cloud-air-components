import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import Notification from 'src/types/Notification';
import { formatTimeAgo } from 'src/utils/dateTimeUtils';
import { setData, setOpen } from '../reducer';
import { useReadNotificationMutation } from 'src/api/notificationApi';
import { clone } from 'lodash';
import { useEffect } from 'react';
export interface NotificationMessageBodyProps {
  notification: Notification;
}

const NotificationMessageBody = (props: NotificationMessageBodyProps) => {
  const { notification } = props;
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.notificationCenter.data);
  const navigate = useNavigate();
  const [ readNotification, { data: readResult } ] = useReadNotificationMutation();
  const { t , i18n } = useTranslation();
  const variant = notification.type.config?.variant;
  const linkColor = variant && !notification.read ? `${variant}.main` : 'text.link';

  useEffect(() => {
    if (readResult) {
      // Replace the read notification from data with the new updated one
      const newData = clone(data);
      newData[data.findIndex(item => item.id === readResult.id)] = readResult;
      dispatch(setData(newData));
    }
  }, [ readResult ]);

  const handleReadNotification = (notification: Notification) => {
    readNotification(notification.id);
  };

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
      <Link
        sx={{ cursor: 'pointer' }}
        onClick={event => {
          event.stopPropagation();
          dispatch(setOpen(false));
          handleReadNotification(notification);
          navigate(notification.url);
        }}
      >
        {t('notification.view')}
      </Link>
    </Typography>}
  </>;
};

export default NotificationMessageBody;