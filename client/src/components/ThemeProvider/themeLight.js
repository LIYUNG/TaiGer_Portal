import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themeLight = createTheme({
  // Light mode theme configuration
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#f50057'
    },
    text: {
      primary: '#000000', // Set the primary text color to black
      secondary: '#46505A'
    },
    action: {
      active: '#001E3C'
    },
    mode: 'light'
  }
});
themeLight = responsiveFontSizes(themeLight);

export default themeLight;
