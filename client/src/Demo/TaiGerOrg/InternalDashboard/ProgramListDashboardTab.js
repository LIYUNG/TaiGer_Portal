import React from 'react';
import { Box, Card } from '@mui/material';
import {
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    Bar,
    ResponsiveContainer
} from 'recharts';
import { appConfig } from '../../../config';

function ProgramDistributionChart({ data, x_key }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={`${x_key}`} />
                <YAxis allowDecimals={false} />
                <Bar
                    dataKey="count"
                    fill="#8884d8"
                    label={{ position: 'top' }}
                />
                <Tooltip labelStyle={{ color: 'black' }} />
                <Legend />
            </BarChart>
        </ResponsiveContainer>
    );
}

const ProgramListDashboardTab = ({ data }) => {
    return (
        <>
            <Card sx={{ p: 2 }}>
                <Box>
                    {appConfig.companyName} ProgramList Distribution By Country:
                    <ProgramDistributionChart
                        data={data?.countryCount}
                        x_key="country"
                    />
                    By School:
                    <ProgramDistributionChart
                        data={data?.schoolCount}
                        x_key="school"
                    />
                    By Language:
                    <ProgramDistributionChart
                        data={data?.langCount}
                        x_key="lang"
                    />
                    By Degree:
                    <ProgramDistributionChart
                        data={data?.degreeCount}
                        x_key="degree"
                    />
                    By Last Update:
                    <ProgramDistributionChart
                        data={data?.updatedAtCount}
                        x_key="updatedAt"
                    />
                    By Who Updates
                    <ProgramDistributionChart
                        data={data?.whoupdatedCount}
                        x_key="whoupdated"
                    />
                </Box>
            </Card>
        </>
    );
};

export default ProgramListDashboardTab;
