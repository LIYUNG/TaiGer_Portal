import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const PageNotFoundError = () => {
    return (
        <Box>
            <Card sx={{ p: 1 }}>
                <Typography variant="h6">Page Not Found!</Typography>
            </Card>
        </Box>
    );
};

export default PageNotFoundError;
