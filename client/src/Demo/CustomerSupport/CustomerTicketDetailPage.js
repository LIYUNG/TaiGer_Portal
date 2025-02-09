import React, { Suspense } from 'react';
import { useLoaderData, Await, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';

import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/Loading';
import CustomerTicketDetailPageBody from './CustomerTicketDetailPageBody';
import DEMO from '../../store/constant';

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const returnBack = () => {
        navigate(DEMO.CUSTOMER_CENTER_LINK);
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item md={12} xs={12}>
                    <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography gutterBottom variant="h5">
                                    {t('Not found', { ns: 'common' })}
                                </Typography>
                                <Typography gutterBottom variant="body1">
                                    {t('Error loading the ticket!', {
                                        ns: 'common'
                                    })}
                                </Typography>
                                <Button onClick={returnBack} variant="outlined">
                                    {t('Back', { ns: 'common' })}
                                </Button>{' '}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const CustomerTicketDetailPage = () => {
    const { t } = useTranslation();
    const { complaintTicket } = useLoaderData();

    TabTitle(t('Customer Center', { ns: 'common' }));

    return (
        <Box data-testid="customer_support">
            <Suspense fallback={<Loading />}>
                <Await errorElement={<NotFound />} resolve={complaintTicket}>
                    {(loadedData) => (
                        <CustomerTicketDetailPageBody
                            complaintTicket={loadedData}
                        />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};

export default CustomerTicketDetailPage;
