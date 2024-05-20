// themeDark.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let themeDark = createTheme({
  // Dark mode theme configuration
  palette: {
    mode: 'dark'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => `
        a {
          color: ${themeParam.palette.info.light};
        }
      `
    }
  }
});

themeDark = responsiveFontSizes(themeDark);


export default themeDark;
