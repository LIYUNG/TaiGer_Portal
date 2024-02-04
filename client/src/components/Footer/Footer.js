import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, CssBaseline, Link } from '@mui/material';

export default function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { i18n } = useTranslation();

  const handleOnChange = (e) => {
    const storedLanguage = localStorage.getItem('locale');
    if (storedLanguage === e.target.lang || e.target.lang === '') {
      return;
    }

    if (e.target.lang === 'en' || e.target.lang === 'zh-TW') {
      i18n.changeLanguage(e.target.lang);
      localStorage.setItem('locale', e.target.lang);
    } else {
      i18n.changeLanguage('en');
      localStorage.setItem('locale', e.target.lang);
    }
  };

  function Copyright() {
    return (
      <Typography variant="string" color="text.secondary">
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
              align="center"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography component={'span'} variant="string" fontWeight="bold">
                Language &nbsp;
              </Typography>
              <Typography
                component={'span'}
                variant="string"
                lang="en"
                onClick={handleOnChange}
                fontWeight={
                  localStorage.getItem('locale') === 'en' ? 'bold' : 'light'
                }
                style={{
                  cursor:
                    localStorage.getItem('locale') === 'en' ? '' : 'pointer'
                }}
              >
                English
              </Typography>
              <Typography component={'span'}>&nbsp;|&nbsp;</Typography>
              <Typography
                component={'span'}
                variant="string"
                lang="zh-TW"
                onClick={handleOnChange}
                fontWeight={
                  localStorage.getItem('locale') === 'zh-TW'
                    ? 'bold'
                    : 'regular'
                }
                style={{
                  cursor:
                    localStorage.getItem('locale') === 'zh-TW' ? '' : 'pointer'
                }}
              >
                中文
              </Typography>
            </Box>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </>
    // <footer>
    //   <Container maxWidth="sm">
    //     <Typography variant="body2" color="textSecondary" align="center">
    //       <ul
    //         onClick={handleOnChange}
    //         className="my-1 py-0"
    //         style={{
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           listStyle: 'none', // Corrected property name
    //           padding: '2px'
    //         }}
    //       >
    //         <li >
    //           <b>Language &nbsp;</b>
    //
    //         <li
    //           lang="en"
    //
    //           style={{
    //             cursor: localStorage.getItem('locale') === 'en' ? '' : 'pointer'
    //           }}
    //         >
    //           {localStorage.getItem('locale') === 'en' ? (
    //             <b>English</b>
    //           ) : (
    //             'English'
    //           )}
    //
    //         <li >&nbsp;|&nbsp;
    //         <li
    //           lang="zh-TW"
    //
    //           style={{
    //             cursor:
    //               localStorage.getItem('locale') === 'zh-TW' ? '' : 'pointer'
    //           }}
    //         >
    //           {localStorage.getItem('locale') === 'zh-TW' ? (
    //             <b>中文</b>
    //           ) : (
    //             '中文'
    //           )}
    //
    //       </ul>
    //     </Typography>{' '}
    //     <Typography variant="body3" color="textSecondary" align="center">
    //       Copyright TaiGer Consultancy © {currentYear} | Designed and developed
    //       by &nbsp;
    //       <a href="https://taigerconsultancy.com/" className="text-info">
    //         TaiGer Consultancy 台德留學顧問
    //       </a>
    //     </Typography>
    //   </Container>
    // </footer>
  );
}
