import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }

  interface TypeText {
    contrast: string;
  }

  interface TypeBackground {
    light: string;
    dark: string;
    gray: string;
  }

  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    subtitle4: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    body5: React.CSSProperties;
    body6: React.CSSProperties;
    buttonSmall: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties;
    subtitle4?: React.CSSProperties;
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    body5?: React.CSSProperties;
    body6?: React.CSSProperties;
    buttonSmall?: React.CSSProperties;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    cloud: {
      info: string;
      success: string;
      error: string;
      warning: string;
      violet: string;
    };
    violet: Palette['primary'];
    text: TypeText;
  }
  interface PaletteOptions {
    cloud: {
      info: string;
      success: string;
      error: string;
      warning: string;
      violet: string;
    };
    violet: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    subtitle4: true;
    body3: true;
    body4: true;
    body5: true;
    body6: true;
    buttonSmall: true;
  }
}

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#F17C23',
      light: '#ed8537',
      dark: '#ed7011',
      contrastText: '#fff'
    },
    secondary: {
      main: '#00B78E',
      light: '#02e3b1',
      dark: '#008a6b',
      contrastText: '#fff'
    },
    success: {
      main: '#2ECC71',
      light: '#4bcc82',
      dark: '#0ec95e',
      contrastText: '#fff'
    },
    error: {
      main: '#E74C3C',
      light: '#e36559',
      dark: '#e32c19',
      contrastText: '#fff'
    },
    warning: {
      main: '#F39C12',
      light: '#f2ad3f',
      dark: '#d18102',
      contrastText: '#fff'
    },
    info: {
      main: '#4576E5',
      light: '#668ce3',
      dark: '#1d59e0',
      contrastText: '#fff'
    },
    violet: {
      main: '#6941C6',
      light: '#7758bf',
      dark: '#5425c2',
      contrastText: '#fff'
    },
    background: {
      paper: '#FFFFFF',
      default: '#F6F8FF',
      light: '#FDFDFD',
      gray: '#ECF0F1',
      dark: '#1E272E',
    },
    cloud: {
      info: '#D9EEFF',
      success: '#D7FDE7',
      error: '#FEE2E0',
      warning: '#FFF5D9',
      violet: '#F0E5FF'
    },
    text: {
      primary: '#1E272E',
      secondary: '#475569',
      disabled: '#CBCECB',
      contrast: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: [
      'Urbanist',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 600,
      lineHeight: 1.1071428571,
      letterSpacing: -1.12
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.08333333333,
      letterSpacing: -0.96
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.1875,
      letterSpacing: -0.64
    },
    h4 :{
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2142857143,
      letterSpacing: -0.56
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: -0.48,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.3333333333,
      letterSpacing: -0.36
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    subtitle3: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    subtitle4: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4285714286,
      letterSpacing: 0.14
    },
    body3: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4285714286,
      letterSpacing: 0.14
    },
    body4: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4285714286,
      letterSpacing: 0.14
    },
    body5: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.3333333333,
      letterSpacing: 0.12
    },
    body6: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.3333333333,
      letterSpacing: 0.12
    },
    button: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      textTransform: 'none',
    },
    buttonSmall: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4285714286,
      letterSpacing: 0.14,
      textTransform: 'none',
    },
    caption: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5
    }
  },
}));

export default theme;