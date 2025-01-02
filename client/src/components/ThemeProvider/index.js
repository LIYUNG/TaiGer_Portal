import React from 'react';
import { createContext, useContext, useState } from 'react';
import themeLight from './themeLight';
import themeDark from './themeDark';
import { ThemeProvider } from '@mui/material';

const CustomThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    const isStoredDarkMode = localStorage.getItem('mode') === 'dark';
    const [isDarkMode, setIsDarkMode] = useState(isStoredDarkMode);

    const toggleDarkMode = () => {
        localStorage.setItem('mode', !isDarkMode ? 'dark' : 'light');
        setIsDarkMode(!isDarkMode);
    };

    const themeData = { isDarkMode, toggleDarkMode };

    return (
        <CustomThemeContext.Provider value={themeData}>
            <ThemeProvider theme={isDarkMode ? themeDark : themeLight}>
                {children}
            </ThemeProvider>
        </CustomThemeContext.Provider>
    );
};

export const useCustomTheme = () => {
    return useContext(CustomThemeContext);
};
