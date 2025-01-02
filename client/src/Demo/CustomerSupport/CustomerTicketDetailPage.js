import React, { Suspense } from 'react';
import { useLoaderData, Await, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';

import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/Loading';
import CustomerTicketDetailPageBody from './CustomerTicketDetailPageBody';
import DEMO from '../../store/constant';

function NotFound() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const returnBack = () => {
        navigate(DEMO.CUSTOMER_CENTER_LINK);
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography variant="h5" gutterBottom>
                                    {t('Not found', { ns: 'common' })}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {t('Error loading the ticket!', {
                                        ns: 'common'
                                    })}
                                </Typography>
                                <Button variant="outlined" onClick={returnBack}>
                                    {t('Back', { ns: 'common' })}
                                </Button>{' '}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function CustomerTicketDetailPage() {
    const { t } = useTranslation();
    const { complaintTicket } = useLoaderData();

    TabTitle(t('Customer Center', { ns: 'common' }));

    return (
        <Box data-testid="customer_support">
            <Suspense fallback={<Loading />}>
                <Await resolve={complaintTicket} errorElement={<NotFound />}>
                    {(loadedData) => (
                        <CustomerTicketDetailPageBody
                            complaintTicket={loadedData}
                        />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
}

export default CustomerTicketDetailPage;
