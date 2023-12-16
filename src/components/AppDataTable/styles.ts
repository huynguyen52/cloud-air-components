import { CSSObject } from '@emotion/react';
import { useTheme } from '@mui/material';
import { isNumber } from 'lodash';

const useTableStyles = (height: string | number, isSticky?: boolean) => {
  const theme = useTheme();
  return ({
    '& .TableContainer-root': height ? { height: `${isNumber(height) ? `${height}px`: height} !important` } : {},
    '& thead': isSticky ? {
      position: 'sticky',
      top: 0,
      zIndex: 400,
      bgcolor: theme.palette.background.paper
    } : {},
    'th .Content-alignCenter': {
      pl: 3
    },
    'thead.MuiTableHead-root': {
      bgcolor: theme.palette.background.gray,
      height: '100%',
      '.MuiTableCell-root': {
        px: 1.5,
        py: 0.75,
        borderBottom: `1px solid ${theme.palette.background.gray}`,
        ...theme.typography.body6,
        textTransform: 'uppercase',
        svg: {
          width: theme.typography.pxToRem(16),
          height: theme.typography.pxToRem(16),
        },
        '&.TableFixedCell-dividerRight': {
          borderRight: 'none'
        },
        '&.TableFixedCell-dividerLeft': {
          borderLeft: 'none'
        },
        '.Title-title': {
          whiteSpace: 'initial',
        }
      },
      '.TableFixedCell-fixedCell': {
        bgcolor: theme.palette.background.gray,
      },
      '.TableInvisibleRow-row th.MuiTableCell-root': {
        padding: 0
      }
    },
    tbody: {
      'tr.MuiTableRow-root': {
        bgcolor: 'background.light'
      },
      '.MuiTableCell-root': {
        padding: `${theme.spacing(2)} ${theme.spacing(1.5)} !important`,
        borderBottom: `1px solid ${theme.palette.background.gray}`,
        ...theme.typography.body4,
        whiteSpace: 'initial',
        '&.TableFixedCell-dividerRight': {
          borderRight: 'none'
        },
        '&.TableFixedCell-dividerLeft': {
          borderLeft: 'none'
        },
        '&.TableFixedCell-fixedCell': {
          bgcolor: 'background.light'
        },
      },
    }
  } as CSSObject);
};

export default useTableStyles;