import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const SingleBarChart = ({
    data,
    dataKey = 'name',
    dataYKey = 'uv',
    label,
    yLabel
}) => {
    const labels = data.map((d) => d[dataKey]);
    const active_a = data.map((d) => d[dataYKey]);
    return (
        <BarChart
            barLabel="value"
            height={300}
            series={[{ data: active_a, label: label }]}
            xAxis={[
                {
                    data: labels,
                    scaleType: 'band',
                    id: 'axis2',
                    interval: 0
                }
            ]}
            yAxis={[
                {
                    label: yLabel
                }
            ]}
        />
    );
};

export default SingleBarChart;
