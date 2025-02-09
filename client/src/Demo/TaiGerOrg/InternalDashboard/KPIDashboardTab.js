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
            <Grid item md={4} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed CV KPI</Typography>
                    <ResponsiveContainer height={300} width="100%">
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
                                angle={270}
                                axisLine={false}
                                dataKey="name"
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                            />
                            <YAxis>
                                <Label
                                    angle={-90}
                                    position="insideLeft"
                                    value="Duration (days)"
                                />
                            </YAxis>
                            <Tooltip labelStyle={{ color: 'black' }} />
                            <Legend />
                            <Bar dataKey="duration" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
            <Grid item md={4} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed ML KPI</Typography>
                    <ResponsiveContainer height={300} width="100%">
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
                                angle={270}
                                axisLine={false}
                                dataKey="name"
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                            />
                            <YAxis>
                                <Label
                                    angle={-90}
                                    position="insideLeft"
                                    value="Duration (days)"
                                />
                            </YAxis>
                            <Tooltip labelStyle={{ color: 'black' }} />
                            <Legend />
                            <Bar dataKey="duration" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
            <Grid item md={4} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>Closed RL KPI</Typography>
                    <ResponsiveContainer height={300} width="100%">
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
                                angle={270}
                                axisLine={false}
                                dataKey="name"
                                dx={0}
                                dy={25}
                                minTickGap={-200}
                            />
                            <YAxis>
                                <Label
                                    angle={-90}
                                    position="insideLeft"
                                    value="Duration (days)"
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
