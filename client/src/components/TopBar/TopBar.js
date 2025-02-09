import React from 'react';
import { Card, Typography } from '@mui/material';

export const TopBar = () => {
    return (
        <Card sx={{ p: 2, mb: 1 }}>
            <Typography color="red" variant="h5">
                Status: <b>Close</b>
            </Typography>
        </Card>
    );
};
