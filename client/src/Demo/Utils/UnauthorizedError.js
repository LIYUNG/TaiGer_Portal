import React from 'react';
import { Box, Card } from '@mui/material';

import { appConfig } from '../../config';

// Status 403: Forbidden requests
const UnauthorizedError = () => {
    return (
        <Box>
            <Card>
                Permission Denied. 請跟您的 {appConfig.companyName} 顧問聯繫
            </Card>
        </Box>
    );
};

export default UnauthorizedError;
