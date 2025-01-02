// themeDark.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette } from './paletteDark';

let themeDark = createTheme({
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
        },
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

themeDark = responsiveFontSizes(themeDark);

export default themeDark;
