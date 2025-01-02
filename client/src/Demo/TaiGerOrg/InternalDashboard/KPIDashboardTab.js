import React from 'react';
import { Typography, Grid, Card } from '@mui/material';
import {
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
    ResponsiveContainer,
    Legend,
    Label
} from 'recharts';

const KPIDashboardTab = ({
    CVdataWithDuration,
    MLdataWithDuration,
    RLdataWithDuration
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed CV KPI</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={CVdataWithDuration}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={270}
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                                axisLine={false}
                            />
                            <YAxis>
                                <Label
                                    value="Duration (days)"
                                    angle={-90}
                                    position="insideLeft"
                                />
                            </YAxis>
                            <Tooltip labelStyle={{ color: 'black' }} />
                            <Legend />
                            <Bar dataKey="duration" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed ML KPI</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={MLdataWithDuration}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={270}
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                                axisLine={false}
                            />
                            <YAxis>
                                <Label
                                    value="Duration (days)"
                                    angle={-90}
                                    position="insideLeft"
                                />
                            </YAxis>
                            <Tooltip labelStyle={{ color: 'black' }} />
                            <Legend />
                            <Bar dataKey="duration" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed RL KPI</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={RLdataWithDuration}
                            margin={{
                                top: 20,
                                right: 0,
                                left: 0,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={270}
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                                axisLine={false}
                            />
                            <YAxis>
                                <Label
                                    value="Duration (days)"
                                    angle={-90}
                                    position="insideLeft"
                                />
                            </YAxis>
                            <Tooltip labelStyle={{ color: 'black' }} />
                            <Legend />
                            <Bar dataKey="duration" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
        </Grid>
    );
};

export default KPIDashboardTab;
