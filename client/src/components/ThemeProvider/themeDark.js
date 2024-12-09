// themeDark.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8', // Google Blue (lighter tint for dark mode)
      contrastText: '#000000'
    },
    secondary: {
      main: '#fdd663', // Google Yellow (lighter tint for dark mode)
      contrastText: '#000000'
    },
    background: {
      default: '#202124', // Google dark gray for main background
      paper: '#303134' // Slightly lighter gray for cards
    },
    text: {
      primary: '#e8eaed', // White for primary text
      secondary: '#bdc1c6' // Light gray for secondary text
    },
    action: {
      active: '#8ab4f8',
      hover: 'rgba(138, 180, 248, 0.1)',
      selected: 'rgba(138, 180, 248, 0.2)'
    },
    divider: '#5f6368' // Medium gray divider
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: '2.25rem',
      fontWeight: 500
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    button: {
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#202124',
          color: '#e8eaed'
        },
        a: {
          color: '#8ab4f8',
          textDecoration: 'none'
        },
        'a:hover': {
          textDecoration: 'underline'
        }
      }
    }
  }
});

themeDark = responsiveFontSizes(themeDark);

export default themeDark;
