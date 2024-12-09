import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(
    localStorage.getItem('locale') || 'en'
  );

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    if (selectedLanguage === language) return;

    if (['en', 'zh-TW'].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('locale', selectedLanguage);
      setLanguage(selectedLanguage);
    }
  };

  function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {`Copyright © ${currentYear} | Designed and developed by `}
        <Link color="inherit" href="https://taigerconsultancy.com/">
          TaiGer Consultancy 台德留學顧問
        </Link>{' '}
      </Typography>
    );
  }

  return (
    <>
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
              <FormControl size="small" variant="outlined">
                <InputLabel>
                  <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Language
                </InputLabel>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  label="Language"
                  sx={{
                    minWidth: 120,
                    textAlign: 'center'
                  }}
                >
                  <MenuItem value="en">
                    <ListItemText>English</ListItemText>
                  </MenuItem>
                  <MenuItem value="zh-TW">
                    <ListItemText>中文</ListItemText>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </>
  );
}
