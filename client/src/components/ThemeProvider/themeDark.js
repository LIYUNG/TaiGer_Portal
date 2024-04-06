// themeDark.js
import { createTheme } from '@mui/material/styles';

const themeDark = createTheme({
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

export default themeDark;
