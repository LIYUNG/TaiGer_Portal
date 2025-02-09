import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Alert, Box, Link, Typography } from '@mui/material';

const Banner = ({
    bg,
    link_name,
    removeBanner,
    notification_key,
    path,
    text,
    title
}) => {
    return (
        <Alert
            bg={bg ? bg : 'primary'}
            onClose={
                notification_key
                    ? (e) => removeBanner(e, notification_key)
                    : undefined
            }
            severity={title}
        >
            <Box sx={{ display: 'flex' }}>
                <Typography
                    fontWeight="bold"
                    style={{ textAlign: 'left' }}
                    variant="body2"
                >
                    {title ? title : 'Reminder'}:
                </Typography>
                <Typography style={{ textAlign: 'left' }} variant="body2">
                    {text}
                </Typography>
                <Typography style={{ textAlign: 'left' }} variant="body2">
                    <Link component={LinkDom} to={`${path}`}>
                        {link_name}
                    </Link>{' '}
                </Typography>
            </Box>
        </Alert>
    );
};

export default Banner;
