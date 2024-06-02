import React from 'react';
import { Card, Typography } from '@mui/material';

export const TopBar = () => {
  return (
    <Card sx={{ p: 2, mb: 1 }}>
      <Typography variant="h5" color="red">
        Status: <b>Close</b>
      </Typography>
    </Card>
  );
};
