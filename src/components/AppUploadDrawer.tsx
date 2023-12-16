import React, { ReactNode, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Drawer, Box, Typography, Grid, LinearProgress, IconButton, useTheme } from '@mui/material';
import AppButton from './AppButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { t } from 'i18next';
import UploadIcon from '../assets/icons/icon-upload.svg';
import CloseIcon from '@mui/icons-material/Close';
import { UseLazyQuery, UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/query';
import { AppBaseQuery } from 'src/api/appBaseQuery';
import UploadStatusData, { UploadStatus } from 'src/types/UploadStatus';
import { ExtraProps, UploadFileRequest } from 'src/types/Request';
import { useConfirm } from './AppConfirm';
import { useInterval } from 'usehooks-ts';
import { DEFAULT_UPLOAD_STATUS_INTERVAL } from 'src/constants/common';

interface AppUploadDrawerProps {
  open: boolean;
  onClose: () => void;
  renderPreview: () => ReactNode;
  useUploadMutation: UseMutation<MutationDefinition<UploadFileRequest, AppBaseQuery, string, UploadStatusData, string>>;
  useGetStatusQuery: UseLazyQuery<QueryDefinition<ExtraProps, AppBaseQuery, string, UploadStatusData, string>>;
  useSaveMutation: UseMutation<MutationDefinition<ExtraProps, AppBaseQuery, string, void, string>>;
  useCancelMutation: UseMutation<MutationDefinition<ExtraProps, AppBaseQuery, string, void, string>>;
  confirmSaveMessage: string; // Translation key
  confirmCancelMessage: string; // Translation key
  extraProps?: ExtraProps;
}

const AppUploadDrawer: React.FC<AppUploadDrawerProps> = (props: AppUploadDrawerProps) => {
  const theme = useTheme();
  const { open, onClose, useUploadMutation, renderPreview, extraProps = {},
    useGetStatusQuery, confirmSaveMessage, confirmCancelMessage,
    useSaveMutation, useCancelMutation
  } = props;

  const [ getUploadStatus, { data: statusData, error: statusError } ] = useGetStatusQuery();
  const [ uploadFile ] = useUploadMutation();
  const [ saveUploadedData, { isLoading: loadingSave } ] = useSaveMutation();
  const [ cancelUploadedData, { isLoading: loadingCancel } ] = useCancelMutation();
  const { confirm } = useConfirm();

  const [ progress, completed, uploading ] = useMemo(() => [
    (statusData?.processed || 0) / (statusData?.total || 1),
    !statusError && statusData?.status === UploadStatus.COMPLETED,
    !statusError && statusData?.status === UploadStatus.IN_PROGRESS ]
  , [ statusData, statusError ]);

  useEffect(() => {
    if (open) {
      getUploadStatus(extraProps);
    }
  }, [ open ]);

  useInterval(() => getUploadStatus(extraProps),
    !statusError && statusData?.status === UploadStatus.IN_PROGRESS ? DEFAULT_UPLOAD_STATUS_INTERVAL : null);

  const onDrop = (acceptedFiles: File[]) => {
    const [ file ] = acceptedFiles;
    uploadFile({ file, extraProps }).unwrap().then(() => getUploadStatus(extraProps));
  };

  const handleClose = async () => {
    if (completed) {
      const [ confirmed ] = await confirm({
        title: t(`${confirmCancelMessage}.title`),
        message: t(`${confirmCancelMessage}.message`),
        confirmLabel: t(`${confirmCancelMessage}.confirm`),
        cancelLabel: t(`${confirmCancelMessage}.cancel`),
      });
      if (confirmed) {
        cancelUploadedData(extraProps).unwrap().then(() => {
          getUploadStatus(extraProps);
          onClose();
        });
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    const [ confirmed ] = await confirm({
      title: t(`${confirmSaveMessage}.title`),
      message: t(`${confirmSaveMessage}.message`),
      confirmLabel: t(`${confirmSaveMessage}.confirm`),
      cancelLabel: t(`${confirmSaveMessage}.cancel`),
    });
    if (confirmed) {
      saveUploadedData(extraProps).unwrap().then(() => {
        getUploadStatus(extraProps);
        onClose();
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const LinearProgressWithLabel = (props: { value: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Box sx={{
        width: '100%',
        pl: 7.5,
        mr: 0.75,
      }}>
        <LinearProgress
          variant="determinate"
          {...props}
        />
      </Box>
      <Box>
        <Typography variant="body2">
          {`${Math.round(
            props.value,
          )}%`}</Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Grid container sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{
          px: 3, py: 2.5,
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.palette.background.gray}`,
        }}>
          <AppButton
            sx={{
              borderRadius: theme.typography.pxToRem(6),
              border: `1px solid ${theme.palette.background.gray}`,
              backgroundColor: theme.palette.background.light,
              p: 1,
              minWidth: 0,
            }}
            onClick={handleClose}
          >
            <ArrowBackIcon />
          </AppButton>
          <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}>
            <Typography variant="subtitle1">{t('course.importMofResult')}</Typography>
          </Box>
        </Box>

        <Box sx={{
          flexGrow: 1,
          p: 3,
          width: completed ? theme.typography.pxToRem(1150) : theme.typography.pxToRem(460),
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {!completed ? (
            <Box
              {...getRootProps()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                px: 4,
                py: 2,
                border: '1px dashed black',
                cursor: 'pointer',
                '& img': {
                  alignItems: 'center',
                  width: theme.typography.pxToRem(56),
                  height: theme.typography.pxToRem(56),
                }
              }}
            >
              <input {...getInputProps()} />
              {
                uploading ?
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing(2),
                    }}>
                      <Box sx={{
                        '& img': {
                          width: theme.typography.pxToRem(32),
                          height: theme.typography.pxToRem(32),
                          borderRadius: theme.typography.pxToRem(999),
                          backgroundColor: theme.palette.cloud.warning,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'content-box',
                          p: 0.75
                        }
                      }}>
                        <img src={UploadIcon} alt="icon" />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: theme.typography.pxToRem(246), gap: 0.75 }}>
                        <Typography variant="body4" sx={{ wordBreak: 'break-word' }}>{statusData?.fileName}</Typography>
                        <Typography variant="body2">({((statusData?.fileSize || 0) / 1000000).toFixed(2)} MB)</Typography>
                      </Box>
                      <IconButton
                        sx={{
                          alignItems: 'flex-end',
                          borderRadius: theme.typography.pxToRem(6),
                          boxShadow: '0px 2px 6px 0px rgba(71, 85, 105, 0.10)',
                        }}
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          cancelUploadedData(extraProps).unwrap().then(() => getUploadStatus(extraProps));
                        }}
                      >
                        <CloseIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Box>
                    <LinearProgressWithLabel value={progress} />
                  </Box> :
                  isDragActive ?
                    <Typography>{t('course.dropFileHere')}</Typography> :
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={UploadIcon} alt="icon" />
                      <Typography sx={{ color: theme.palette.secondary.main }} variant="body2">
                        {t('course.dropFile')}
                      </Typography>
                      <Typography variant="body2">
                        {t('course.maxSizeMofResult')}
                      </Typography>
                    </Box>
              }
            </Box>
          ) : renderPreview()}
        </Box>
        {completed && <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 3,
          width: '100%',
          backgroundColor: theme.palette.background.light,
          position: 'absolute',
          bottom: 0,
          boxShadow: '0px -4px 12px 0px rgba(0, 0, 0, 0.15)'
        }}>
          <AppButton variant="outlined" onClick={handleClose} fullWidth loading={loadingCancel}>
            {t('common.cancel')}
          </AppButton>
          <AppButton variant="contained" onClick={handleSave} fullWidth loading={loadingSave}>
            {t('common.confirm')}
          </AppButton>
        </Box>}
      </Grid>
    </Drawer>
  );
};

export default AppUploadDrawer;
