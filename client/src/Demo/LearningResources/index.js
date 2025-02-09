import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Card, Typography } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { is_TaiGer_Student, is_TaiGer_role } from '@taiger-common/core';

const LearningResources = () => {
    const { user } = useAuth();

    if (!is_TaiGer_role(user) && !is_TaiGer_Student(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Learning Resources');

    return (
        <Box>
            <Card>
                <Typography>Resources A</Typography>
                <Typography>Comming soon!</Typography>
            </Card>
        </Box>
    );
};

export default LearningResources;
