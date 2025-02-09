import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { TabTitle } from '../Utils/TabTitle';

import DashboardBody from './DashboardBody';
import { Box } from '@mui/material';
import Loading from '../../components/Loading/Loading';

const Dashboard = () => {
    const { studentAndEssays } = useLoaderData();

    TabTitle('Home Page');

    return (
        <Box data-testid="dashoboard_component">
            <Suspense fallback={<Loading />}>
                <Await resolve={studentAndEssays}>
                    {(loadedData) => (
                        <DashboardBody studentAndEssays={loadedData} />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};

export default Dashboard;
