import React from 'react';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Example icon from Material UI
import i18next from 'i18next';

const DefaultErrorPage = () => {
    const error = useRouteError();

    const getErrorMessage = () => {
        if (error?.status) {
            return (
                <>
                    <Typography component="h3" sx={{ mb: 1 }} variant="h6">
                        <strong>Status:</strong> {error.status}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Message:</strong> {error.message}
                    </Typography>
                </>
            );
        }
        return (
            <Typography variant="body1">
                <strong>Error:</strong> Server did not respond.{' '}
                {error?.message || ''}
            </Typography>
        );
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    padding: 4,
                    boxShadow: 3,
                    textAlign: 'center'
                }}
            >
                <ErrorOutlineIcon
                    sx={{ fontSize: 48, color: 'error.main', mb: 2 }}
                />
                <Typography component="h1" sx={{ mb: 2 }} variant="h5">
                    {i18next.t('something-went-wrong')}
                </Typography>
                {getErrorMessage()}
                <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={2}
                    sx={{ mt: 3 }}
                >
                    <Button
                        color="primary"
                        onClick={() => (window.location.href = '/')} // Redirect to home page
                        variant="contained"
                    >
                        Go to Home
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => window.location.reload()}
                        variant="outlined"
                    >
                        Retry
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
};

export default DefaultErrorPage;
