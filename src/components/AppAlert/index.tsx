import { AlertColor, AlertProps } from '@mui/material';
import { AlertConfig, AlertId, AlertState, hideAlert } from './reducer';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { capitalize, compact, first, isObject, isString, toLower } from 'lodash';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { AlertType } from 'src/constants/enums';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import BaseAlert from './components/BaseAlert';

export interface AppAlertProps extends AlertProps {
  ids: AlertId[];
  configs?: { [key: AlertId]: (string | AlertConfig) };
  inline?: boolean;
  mb?: number;
}

const overrideTitleWithSchema = (schema: string | undefined, newTitle: string | undefined, type: AlertType, t: TFunction<'translation', undefined>) =>
  schema && isString(schema) ? capitalize(t(`${schema}.${type}`, { title: toLower(newTitle) })) : newTitle || t('alert.title.default');

const overrideAlertConfig = (config: AlertState | undefined, overrideConfigs: { [key: AlertId]: (string | AlertConfig) }, t: TFunction<'translation', undefined>): AlertState | undefined => {
  if (!config) return config;
  const overrideConfig = overrideConfigs[config.id];
  if (isObject(overrideConfig)) {
    const schema = overrideConfig.titleSchema || config.titleSchema;
    const title = overrideConfig.title || config.title;
    return {
      ...config,
      title: schema ? overrideTitleWithSchema(schema, title, config.type, t)
        : title,
    };
  }
  const title = overrideConfig || config.title;
  return {
    ...config,
    title: config.titleSchema ? overrideTitleWithSchema(config.titleSchema, title, config.type, t)
      : title
  };
};

export const AppAlert = (props: AppAlertProps) => {
  const { ids, inline = false, configs = {}, mb = 3 } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const previousLoadingAlert = useRef<string | undefined>();
  const matchedAlert = overrideAlertConfig(
    useAppSelector(state => first(compact(ids.map(item => {
      const [ id, type ] = item.toString().split('.');
      const idRegexp = new RegExp(id, 'g');
      const foundId = Object.keys(state.alert.pool).find(key => idRegexp.test(key));
      const alertState = state.alert.pool[foundId || id];
      if (alertState && type) {
        return type === alertState.type ? alertState : undefined;
      }
      return alertState;
    })))), configs, t);
  const defaultSeverity = 'info';
  const [ open, setOpen ] = useState(false);
  const [ severity, setSeverity ] = useState(defaultSeverity);

  useEffect(() => {
    if (matchedAlert) {
      setSeverity((matchedAlert.type === AlertType.LOADING) ? defaultSeverity : matchedAlert.type);
      setTimeout(() => setOpen(true), 200);
    } else {
      setOpen(false);
      setTimeout(() => setSeverity(defaultSeverity), 200);
    }
  }, [ matchedAlert ]);

  useEffect(() => {
    if (open && !inline) {
      if (previousLoadingAlert.current) {
        closeSnackbar(previousLoadingAlert.current);
        previousLoadingAlert.current = undefined;
      }
      const globalAlertId = `${matchedAlert?.id}.${matchedAlert?.type}`;
      if (matchedAlert?.title) {
        enqueueSnackbar({
          key: globalAlertId,
          variant: severity as 'success' | 'warning' | 'info' | 'error' | 'default' | undefined,
          autoHideDuration: matchedAlert?.duration || null,
          action: matchedAlert?.title,
          message: matchedAlert?.message,
          onExited: handleClose
        });
      }
      if (matchedAlert?.type === 'loading') {
        previousLoadingAlert.current = globalAlertId;
      }
    }
  }, [ open, severity ]);

  const handleClose = () => matchedAlert && dispatch(hideAlert(matchedAlert?.id));

  if (inline) {
    return (<BaseAlert
      open={open}
      severity={severity as AlertColor}
      mb={mb}
      title={matchedAlert?.title}
      message={matchedAlert?.message}
      handleClose={handleClose}
    />);
  }
};
