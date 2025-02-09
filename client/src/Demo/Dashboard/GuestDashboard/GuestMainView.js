import React from 'react';
import { Card } from '@mui/material';

const GuestMainView = () => {
    return (
        <Card className="mt-0">
            <Card.Header as="h5">
                <Card.Title>Welcome to Taiger!</Card.Title>
            </Card.Header>
            <Card.Body>
                I hope you will enjoy the journey in the following months.
            </Card.Body>
        </Card>
    );
};

export default GuestMainView;
