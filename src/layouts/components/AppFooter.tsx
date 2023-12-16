import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DEFAULT_FOOTER_HEIGHT } from 'src/constants/common';

const AppFooter = () => {
  const { t } = useTranslation();
  return (<Stack
    justifyContent="center"
    alignItems="center"
    bgcolor="background.paper"
    height={DEFAULT_FOOTER_HEIGHT}
    marginLeft={4}
  >
    <Typography variant="body2">
      {t('common.footerText')}
    </Typography>
  </Stack>);
};

export default AppFooter;