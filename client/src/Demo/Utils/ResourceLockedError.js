import React from 'react';
import { Box, Card } from '@mui/material';

// Status 423: Forbidden requests
function ResourceLockedError() {
    return (
        <Box>
            <Card>The resource is locked and can not be changed.</Card>
        </Box>
    );
}

export default ResourceLockedError;
