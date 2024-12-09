import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themeLight = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8', // Google Blue
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#fbbc04', // Google Yellow
      contrastText: '#ffffff'
    },
    background: {
      default: '#ffffff', // Pure white background
      paper: '#f8f9fa' // Light gray for cards and dialogs
    },
    text: {
      primary: '#202124', // Google dark gray for main text
      secondary: '#5f6368' // Medium gray for secondary text
    },
    action: {
      active: '#1a73e8', // Matches primary color for active items
      hover: 'rgba(26, 115, 232, 0.1)', // Light hover effect
      selected: 'rgba(26, 115, 232, 0.2)' // Subtle selection effect
    },
    divider: '#dadce0' // Light gray divider
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
      textTransform: 'none' // Avoid all caps for buttons
    }
  },
  shape: {
    borderRadius: 8 // Subtle rounded corners for cards and buttons
  }
});
themeLight = responsiveFontSizes(themeLight);

export default themeLight;
