import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';

function DefaultErrorPage() {
  const error = useRouteError();
  if (error.status === 500) {
    return (
      <Box>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" component="h3">
            {error.status}: Server Error.{error.data?.message}
          </Typography>
        </Card>
      </Box>
    );
  } else if (
    error.status === 403 ||
    error.status === 401 ||
    error.status === 404
  ) {
    return (
      <Box>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" component="h3">
            {error.status}: {error.data?.message}
          </Typography>
        </Card>
      </Box>
    );
  } else {
    return (
      <Box>
        <Card>Server No Response Error. {error.data?.message}</Card>
      </Box>
    );
  }
}

export default DefaultErrorPage;
