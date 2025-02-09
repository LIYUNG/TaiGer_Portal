import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    Box,
    CssBaseline,
    FormControl,
    InputLabel,
    Link,
    ListItemText,
    MenuItem,
    Select
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import i18next from 'i18next';

const Copyright = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return (
        <Typography align="center" color="text.secondary" variant="body2">
            {`Copyright © ${currentYear} | Designed and developed by `}
            <Link color="inherit" href="https://taigerconsultancy.com/">
                TaiGer Consultancy 台德留學顧問
            </Link>{' '}
        </Typography>
    );
};

const LanguageSelector = ({ language, handleLanguageChange }) => (
    <FormControl size="small" variant="outlined">
        <InputLabel>
            <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Language
        </InputLabel>
        <Select
            label="Language"
            onChange={handleLanguageChange}
            sx={{ minWidth: 120, textAlign: 'center' }}
            value={language}
        >
            {[
                { value: 'en', label: 'English' },
                { value: 'zh-TW', label: '繁體中文' },
                { value: 'zh-CN', label: '简体中文' }
            ].map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                    <ListItemText>{label}</ListItemText>
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default function Footer() {
    const [language, setLanguage] = useState(
        localStorage.getItem('locale') || 'en'
    );

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;

        if (selectedLanguage === language) return;

        if (['en', 'zh-CN', 'zh-TW'].includes(selectedLanguage)) {
            i18next.changeLanguage(selectedLanguage);
            // i18n.changeLanguage(selectedLanguage);
            localStorage.setItem('locale', selectedLanguage);
            setLanguage(selectedLanguage);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <CssBaseline />
            <Box
                component="footer"
                sx={{
                    py: 2,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800]
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            mb: 1
                        }}
                    >
                        <LanguageSelector
                            handleLanguageChange={handleLanguageChange}
                            language={language}
                        />
                    </Box>
                    <Copyright />
                </Container>
            </Box>
        </Box>
    );
}
