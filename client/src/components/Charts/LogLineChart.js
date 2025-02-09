import React, { useState } from 'react';
import { ButtonGroup, Button } from '@mui/material';
import {
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const LogLineChart = ({ data }) => {
    const [range, setRange] = useState(180);

    const onChangeRange = (e) => {
        e.preventDefault();
        const range = parseInt(e.target.value);
        setRange(range);
    };
    return (
        <>
            <ButtonGroup sx={{ mb: 2 }}>
                <Button
                    onClick={onChangeRange}
                    size="sm"
                    value={7}
                    variant={range === 7 ? 'contained' : 'outlined'}
                >
                    7 days
                </Button>
                <Button
                    onClick={onChangeRange}
                    size="sm"
                    value={30}
                    variant={range === 30 ? 'contained' : 'outlined'}
                >
                    30 days
                </Button>
                <Button
                    onClick={onChangeRange}
                    size="sm"
                    value={60}
                    variant={range === 60 ? 'contained' : 'outlined'}
                >
                    60 days
                </Button>
                <Button
                    onClick={onChangeRange}
                    size="sm"
                    value={180}
                    variant={range === 180 ? 'contained' : 'outlined'}
                >
                    180 days
                </Button>
            </ButtonGroup>
            <ResponsiveContainer height={250} width="100%">
                <LineChart
                    data={data.slice(-range)}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 0,
                        bottom: 40
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        angle={-45}
                        dataKey="date"
                        interval={Math.ceil(range / 12)}
                        textAnchor="end"
                    />
                    <YAxis
                        label={{
                            value: '# of API calls',
                            angle: -90,
                            position: 'insideLeft'
                        }}
                    />
                    <Tooltip labelStyle={{ color: 'black' }} />
                    <Line
                        activeDot={{ r: 8 }}
                        dataKey="apiCallCount"
                        dot={false}
                        stroke="#8884d8"
                        type="monotone"
                    />
                    <Line
                        activeDot={{ r: 8 }}
                        dataKey="get"
                        dot={false}
                        stroke="#a0a0a0"
                        type="monotone"
                    />
                    <Line
                        activeDot={{ r: 8 }}
                        dataKey="post"
                        dot={false}
                        stroke="#0a0a0a"
                        type="monotone"
                    />
                    <Line
                        activeDot={{ r: 8 }}
                        dataKey="put"
                        dot={false}
                        stroke="#c6c6c6"
                        type="monotone"
                    />
                    <Line
                        activeDot={{ r: 8 }}
                        dataKey="delete"
                        dot={false}
                        stroke="#6b6b6b"
                        type="monotone"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default LogLineChart;
