import React from 'react';
import { Box, Card } from '@mui/material';

import PageNotFoundError from './PageNotFoundError';
import TimeOutErrors from './TimeOutErrors';
import UnauthorizedError from './UnauthorizedError';
import UnauthenticatedError from './UnauthenticatedError';
import TooManyRequestsError from './TooManyRequestsError';
import ResourceLockedError from './ResourceLockedError';

function ErrorPage(props) {
  if (props.res_status === 400) {
    return (
      <Box>
        <Card>Server problem. Please try later.</Card>
      </Box>
    );
  } else if (props.res_status === 401) {
    return <UnauthenticatedError />;
  } else if (props.res_status === 403) {
    return <UnauthorizedError />;
  } else if (props.res_status === 404) {
    return <PageNotFoundError />;
  } else if (props.res_status === 408) {
    return <TimeOutErrors />;
  } else if (props.res_status === 423) {
    return <ResourceLockedError />;
  } else if (props.res_status === 429) {
    return <TooManyRequestsError />;
  } else if (props.res_status >= 500) {
    return (
      <Box>
        <Card>Server problem. Please try later.</Card>
      </Box>
    );
  }
}

export default ErrorPage;
