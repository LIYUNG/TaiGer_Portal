import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Alert, Box, Link, Typography } from '@mui/material';

export default function Banner(props) {
    return (
        <Alert
            severity={props.title}
            bg={props.bg ? props.bg : 'primary'}
            onClose={
                props.notification_key
                    ? (e) => props.removeBanner(e, props.notification_key)
                    : undefined
            }
        >
            <Box sx={{ display: 'flex' }}>
                <Typography
                    variant="body2"
                    fontWeight="bold"
                    style={{ textAlign: 'left' }}
                >
                    {props.title ? props.title : 'Reminder'}
                    {':'}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'left' }}>
                    {props.text}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'left' }}>
                    <Link to={`${props.path}`} component={LinkDom}>
                        {props.link_name}
                    </Link>{' '}
                </Typography>
            </Box>
        </Alert>
    );
}
