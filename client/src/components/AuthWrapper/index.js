import React from 'react';
import { Avatar, Box, Container, CssBaseline } from '@mui/material';
import Footer from '../Footer/Footer';
import { appConfig } from '../../config';

export default function AuthWrapper({ children }) {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar
          alt="Your Image"
          src={appConfig.LoginPageLogo}
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            margin: '1px'
          }}
        />
        {children}
      </Box>
      <Footer />
    </Container>
  );
}
