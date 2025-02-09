import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const VerticalDistributionBarCharts = ({
    data,
    k,
    value1,
    value2,
    xLabel,
    dataALabel,
    dataBLabel
}) => {
    const labels = data.map((d) => d[k]);
    const active_a = data.map((d) => d[value1]);
    const potential_a = data.map((d) => d[value2]);
    return (
        <BarChart
            barLabel="value"
            grid={{ vertical: true }}
            height={300}
            layout="horizontal"
            series={[
                { data: active_a, stack: 'A', label: dataALabel },
                { data: potential_a, stack: 'A', label: dataBLabel }
            ]}
            xAxis={[
                {
                    label: xLabel
                }
            ]}
            yAxis={[
                {
                    data: labels,
                    scaleType: 'band',
                    id: 'axis1',
                    interval: 0
                }
            ]}
        />
    );
};

export default VerticalDistributionBarCharts;
