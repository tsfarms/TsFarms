import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#173B28',
      light: '#2a5a42',
      dark: '#0e2a1c',
      contrastText: '#F6F1E7',
    },
    secondary: {
      main: '#D99419',
      light: '#e5ab3d',
      dark: '#b87a12',
      contrastText: '#1C211C',
    },
    background: {
      default: '#F6F1E7',
      paper: '#FFFDF8',
    },
    text: {
      primary: '#1C211C',
      secondary: '#5B3A24',
    },
    divider: 'rgba(23, 59, 40, 0.12)',
  },
  typography: {
    fontFamily: '"Manrope", "DM Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '2.75rem',
      lineHeight: 1.15,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.35,
    },
    body1: {
      fontFamily: '"Manrope", "DM Sans", sans-serif',
      fontSize: '1.0625rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Manrope", "DM Sans", sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.65,
    },
    button: {
      fontFamily: '"Manrope", "DM Sans", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    overline: {
      fontFamily: '"Manrope", "DM Sans", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    caption: {
      fontFamily: '"Manrope", "DM Sans", sans-serif',
      fontSize: '0.8rem',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          overflowX: 'hidden',
          maxWidth: '100vw',
        },
        body: {
          scrollbarColor: '#788267 transparent',
        },
        '::selection': {
          backgroundColor: '#D99419',
          color: '#FFFDF8',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 28px',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
