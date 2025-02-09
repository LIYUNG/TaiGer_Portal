import React from 'react';
import { Box, Card } from '@mui/material';

import { appConfig } from '../../../config';
import SingleBarChart from '../../../components/Charts/SingleBarChart';

const ProgramDistributionChart = ({ data, x_key, y_key }) => {
    return (
        <SingleBarChart
            data={data}
            dataKey={x_key}
            dataYKey={y_key}
            label={x_key}
            yLabel="Duration (days)"
        />
    );
};

const ProgramListDashboardTab = ({ data }) => {
    return (
        <Card sx={{ p: 2 }}>
            <Box>
                {appConfig.companyName} ProgramList Distribution By Country:
                <ProgramDistributionChart
                    data={data?.countryCount}
                    x_key="country"
                    y_key="count"
                />
                By School:
                <ProgramDistributionChart
                    data={data?.schoolCount}
                    x_key="school"
                    y_key="count"
                />
                By Language:
                <ProgramDistributionChart
                    data={data?.langCount}
                    x_key="lang"
                    y_key="count"
                />
                By Degree:
                <ProgramDistributionChart
                    data={data?.degreeCount}
                    x_key="degree"
                    y_key="count"
                />
                By Last Update:
                <ProgramDistributionChart
                    data={data?.updatedAtCount}
                    x_key="updatedAt"
                    y_key="count"
                />
                By Who Updates
                <ProgramDistributionChart
                    data={data?.whoupdatedCount}
                    x_key="whoupdated"
                    y_key="count"
                />
            </Box>
        </Card>
    );
};

export default ProgramListDashboardTab;
