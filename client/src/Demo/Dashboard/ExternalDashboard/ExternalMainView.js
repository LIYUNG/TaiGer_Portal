import React from 'react';
import { Card, Grid, Typography } from '@mui/material';

import {
    frequencyDistribution,
    open_tasks_with_editors
} from '../../Utils/checking-functions';

import { useTranslation } from 'react-i18next';
import ProgramReportCard from '../../Program/ProgramReportCard';

const ExternalMainView = (props) => {
    const { t } = useTranslation();

    const open_tasks_arr = open_tasks_with_editors(props.students);
    const task_distribution = open_tasks_arr
        .filter(({ isFinalVersion }) => isFinalVersion !== true)
        .map(({ deadline, file_type, show, isPotentials }) => {
            return { deadline, file_type, show, isPotentials };
        });
    const open_distr = frequencyDistribution(task_distribution);

    const sort_date = Object.keys(open_distr).sort();

    const sorted_date_freq_pair = [];
    sort_date.forEach((date) => {
        sorted_date_freq_pair.push({
            name: `${date}`,
            active: open_distr[date].show,
            potentials: open_distr[date].potentials
        });
    });

    return (
        <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>External Dashboard</Typography>
                    <Typography variant="h6">
                        {t('Coming soon', { ns: 'common' })}
                    </Typography>
                </Card>
            </Grid>
            <Grid item sm={3} xs={12}>
                <ProgramReportCard />
            </Grid>
        </Grid>
    );
};

export default ExternalMainView;
