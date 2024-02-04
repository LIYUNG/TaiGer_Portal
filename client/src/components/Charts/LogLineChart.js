import React, { useState } from 'react';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Button } from '@mui/material';
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
      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="me-2" aria-label="First group">
          <Button
            variant={range === 7 ? 'primary' : 'outline-primary'}
            value={7}
            onClick={onChangeRange}
            size="sm"
          >
            7 days
          </Button>
          <Button
            variant={range === 30 ? 'primary' : 'outline-primary'}
            value={30}
            onClick={onChangeRange}
            size="sm"
          >
            30 days
          </Button>
          <Button
            variant={range === 60 ? 'primary' : 'outline-primary'}
            value={60}
            onClick={onChangeRange}
            size="sm"
          >
            60 days
          </Button>
          <Button
            variant={range === 180 ? 'primary' : 'outline-primary'}
            value={180}
            onClick={onChangeRange}
            size="sm"
          >
            180 days
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
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
            dataKey="date"
            interval={Math.ceil(range / 12)}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            label={{
              value: '# of API calls',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="apiCallCount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LogLineChart;
