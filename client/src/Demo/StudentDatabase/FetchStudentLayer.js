import React, { useEffect, useState } from 'react';
import { getStudentAndDocLinks } from '../../api';
import { SingleStudentPageMainContent } from './SingleStudentPage';
import { Box, CircularProgress } from '@mui/material';

export const FetchStudentLayer = ({ studentId }) => {
    const [studentData, setStudentData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [, setError] = useState(null);
    useEffect(() => {
        getStudentAndDocLinks(studentId).then(
            (resp) => {
                const {
                    data: { survey_link, base_docs_link, data }
                } = resp;
                setStudentData({ survey_link, base_docs_link, data });
                setIsLoaded(true);
            },
            (error) => {
                setError(error);
                setIsLoaded(true);
            }
        );
    }, [studentId]);
    if (!isLoaded || !studentData.data) {
        return (
            <Box
                sx={{
                    width: window.innerWidth - 60,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box sx={{ width: window.innerWidth - 60 }}>
            <SingleStudentPageMainContent
                base_docs_link={studentData.base_docs_link}
                data={studentData.data}
                survey_link={studentData.survey_link}
            />
        </Box>
    );
};
