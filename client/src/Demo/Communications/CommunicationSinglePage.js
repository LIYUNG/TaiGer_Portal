import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import Loading from '../../components/Loading/Loading';
import CommunicationSinglePageBody from './CommunicationSinglePageBody';

function CommunicationSinglePage() {
    const { data } = useLoaderData();

    return (
        <Box data-testid="communication_student_page">
            <Suspense fallback={<Loading />}>
                <Await resolve={data}>
                    {(loadedData) => (
                        <CommunicationSinglePageBody loadedData={loadedData} />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
}

export default CommunicationSinglePage;
