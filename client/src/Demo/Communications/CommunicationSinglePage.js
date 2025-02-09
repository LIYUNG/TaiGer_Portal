import React, { Suspense } from 'react';
import { Await, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import Loading from '../../components/Loading/Loading';
import CommunicationSinglePageBody from './CommunicationSinglePageBody';
import { getCommunicationQuery } from '../../api/query';
import { useQuery } from '@tanstack/react-query';

const CommunicationSinglePage = () => {
    const { student_id } = useParams();
    const { data } = useQuery(getCommunicationQuery(student_id));

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
};

export default CommunicationSinglePage;
