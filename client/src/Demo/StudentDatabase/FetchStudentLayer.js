import React, { useEffect, useState } from 'react';
import { getStudentAndDocLinks } from '../../api';
import { SingleStudentPageMainContent } from './SingleStudentPage';
import { Box, CircularProgress } from '@mui/material';

export const FetchStudentLayer = ({ studentId }) => {
  const [studentData, setStudentData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setError] = useState(null);
  useEffect(() => {
    console.log(window.innerWidth);
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
  if (!isLoaded) {
    return (
      <Box sx={{ width: window.innerWidth - 60 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ width: window.innerWidth - 60 }}>
      <SingleStudentPageMainContent
        survey_link={studentData.survey_link}
        base_docs_link={studentData.base_docs_link}
        data={studentData.data}
      />
    </Box>
  );
};
