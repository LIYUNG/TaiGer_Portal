import React from 'react';
import { Card, Box } from '@mui/material';

const TooManyRequestsError = () => {
    return (
        <Box>
            <Card>Too many requests. Please try later.</Card>
        </Box>
    );
};

export default TooManyRequestsError;
