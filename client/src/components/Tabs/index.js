import React from 'react';
import { Box, Typography } from '@mui/material';

export const CustomTabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            aria-labelledby={`simple-tab-${index}`}
            data-testid={`custom_tab_panel-${index}`}
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            role="tabpanel"
            {...other}
        >
            {value === index ? (
                <Box>
                    <Typography component="span">{children}</Typography>
                </Box>
            ) : null}
        </div>
    );
};

export const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
};
