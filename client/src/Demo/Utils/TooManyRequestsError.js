import React from 'react';
import { Card, Box } from '@mui/material';

function TooManyRequestsError() {
  return (
    <Box>
      <Card>Too many requests. Please try later.</Card>
    </Box>
  );
}

export default TooManyRequestsError;
