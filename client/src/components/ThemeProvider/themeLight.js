import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './paletteLight';

let themeLight = createTheme({
    palette: palette,
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
    },
    components: {
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: palette.action.hover
                    }
                }
            }
        }
    }
});
themeLight = responsiveFontSizes(themeLight);

export default themeLight;
