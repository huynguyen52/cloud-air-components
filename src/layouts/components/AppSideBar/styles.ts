import { CSSObject } from '@emotion/react';
import { useTheme } from '@mui/material';

const useSideBarStyles = () => {
  const theme = useTheme();
  return ({
    borderTopRightRadius: theme.typography.pxToRem(12),
    borderBottomRightRadius: theme.typography.pxToRem(12),
    backgroundColor: theme.palette.background.dark,
    '.ps-sidebar-container': {
      backgroundColor: 'transparent',
    },
    boxShadow: '4px 0px 6px 0px rgba(15, 23, 42, 0.10)',
    '.ps-menuitem-root:last-child': {
      '.ps-menu-button': {
        marginBottom: 0,
      }
    },
    '.ps-submenu-content': {
      backgroundColor: theme.palette.background.dark,
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
      margin: theme.spacing(1),
      marginTop: 0,
      '.ps-menu-button': {
        height: `${theme.typography.pxToRem(24)} !important`,
        marginBottom: theme.spacing(2),
        svg: {
          stroke: theme.palette.text.contrast,
        },
        '.ps-active': {
          backgroundColor: `${theme.palette.background.dark} !important`,
          '.MuiTypography-root': {
            color: theme.palette.primary.main,
            fontWeight: 700
          },
          svg: {
            stroke: theme.palette.primary.main,
            strokeWidth: 2,
          }
        },
        '&:hover': {
          backgroundColor: `${theme.palette.background.dark} !important`,
          '.MuiTypography-root': {
            fontWeight: 700
          },
          svg: {
            strokeWidth: 2,
          },
        },
      },
      '.ps-menuitem-root:last-child': {
        '.ps-menu-button': {
          marginBottom: 0,
        }
      },
      borderBottom: `1px solid ${theme.palette.background.gray}`,
    },
    '.ps-submenu-expand-icon': {
      display: 'none'
    },
    '.logo': {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      marginBottom: theme.spacing(2),
      '.ps-menu-button': {
        height: 'auto !important',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          backgroundColor: 'transparent !important',
        },
      },
      '.ps-menu-icon': {
        padding: 0,
        margin: 0,
        width: '100%',
        height: '100%',
        '&:hover': {
          backgroundColor: 'transparent !important',
        },
      },
      '.ps-menu-label': {
        whiteSpace: 'normal',
        textAlign: 'center',
      }
    },
    '.ps-menu-label': {
      display: 'block',
      color: theme.palette.text.contrast,
    },
    '&.ps-collapsed .ps-menu-label': {
      display: 'none',
    },
    '.ps-menu-icon': {
      margin: 0,
      width: 'auto',
      height: 'auto',
      padding: theme.spacing(1.5),
      borderRadius: theme.typography.pxToRem(6),
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    '&.ps-collapsed .ps-menu-icon': {
      marginBottom: theme.spacing(1),
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      '&.ps-active': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    '&.ps-collapsed .logo .ps-menu-icon': {
      marginBottom: 0,
    },
    '.ps-menu-button': {
      height: '3rem !important',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      borderRadius: theme.typography.pxToRem(6),
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
      },
      '&.ps-active': {
        backgroundColor: `${theme.palette.primary.main} !important`,
      },
    },
    '&.ps-collapsed .ps-menu-button': {
      height: 'auto !important',
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
      borderRadius: 0,
      '&:hover': {
        backgroundColor: 'transparent !important',
      },
      '&.ps-active': {
        backgroundColor: 'transparent !important',
      },
    }
  } as CSSObject);
};

export default useSideBarStyles;