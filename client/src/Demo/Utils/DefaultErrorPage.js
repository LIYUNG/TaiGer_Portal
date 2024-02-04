import React from 'react';
import { Box, Card } from '@mui/material';
import { useRouteError } from 'react-router-dom';

function DefaultErrorPage() {
  const error = useRouteError();
  if (error.status === 500) {
    return (
      <Box>
        <Card>
          {error.status}: Server Error.{error.data?.message}
        </Card>
      </Box>
    );
  } else if (error.status === 404) {
    return (
      <Box>
        <Card>
          {error.status}: {error.data?.message}
        </Card>
      </Box>
    );
  } else if (error.status === 401) {
    return (
      <Box>
        <Card>
          {error.status}: Unauthorized. {error.data?.message}
        </Card>
      </Box>
    );
  } else if (error.status === 403) {
    return (
      <Box>
        <Card>
          {error.status}: Forbidden. {error.data?.message}
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
