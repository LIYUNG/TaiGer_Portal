import React from 'react';
import { Box, Card } from '@mui/material';

import PageNotFoundError from './PageNotFoundError';
import TimeOutErrors from './TimeOutErrors';
import UnauthorizedError from './UnauthorizedError';
import UnauthenticatedError from './UnauthenticatedError';
import TooManyRequestsError from './TooManyRequestsError';
import ResourceLockedError from './ResourceLockedError';

const ErrorPage = ({ res_status }) => {
    if (res_status === 400) {
        return (
            <Box>
                <Card>Server problem. Please try later.</Card>
            </Box>
        );
    } else if (res_status === 401) {
        return <UnauthenticatedError />;
    } else if (res_status === 403) {
        return <UnauthorizedError />;
    } else if (res_status === 404) {
        return <PageNotFoundError />;
    } else if (res_status === 408) {
        return <TimeOutErrors />;
    } else if (res_status === 423) {
        return <ResourceLockedError />;
    } else if (res_status === 429) {
        return <TooManyRequestsError />;
    } else if (res_status >= 500) {
        return (
            <Box>
                <Card>Server problem. Please try later.</Card>
            </Box>
        );
    }
};

export default ErrorPage;
