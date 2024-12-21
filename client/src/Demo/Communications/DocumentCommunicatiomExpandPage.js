import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { Box, Grid, Typography } from '@mui/material';

import { useAuth } from '../../components/AuthProvider';
import { is_TaiGer_role } from '@taiger-common/core';
import DEMO from '../../store/constant';
import { getMyThreadMessages, getMessagThread } from '../../api';

const getMyThreadMessageQuery = () => ({
  queryKey: ['myThreadMessages'],
  queryFn: async () => {
    try {
      const response = await getMyThreadMessages();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  staleTime: 1000 * 60 // 1 minutes
});

const getThreadMessages = (threadId) => ({
  queryKey: ['threadMessages', threadId],
  queryFn: async () => {
    try {
      console.log('threadId:', threadId);
      const response = await getMessagThread(threadId);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  enabled: !!threadId,
  staleTime: 1000 * 60 // 1 minutes
});

function DocumentCommunicationExpandPage() {
  const { threadId: paramThreadId } = useParams();

  const { user } = useAuth();
  const { t } = useTranslation();
  const [threadId, setThreadId] = useState(paramThreadId);
  const {
    data: myMessagesData,
    isLoading: myMessagesIsLoading,
    isError: myMessagesIsError,
    error: myMessagesError
  } = useQuery(getMyThreadMessageQuery());

  const {
    data: threadData
    // isLoading: threadIsLoading,
    // isError: threadIsError,
    // error: threadError
  } = useQuery(getThreadMessages(threadId));
  console.log('threadData:', threadData);

  const { students = [], studentThreads = [] } =
    myMessagesData?.data?.data || {};

  const { messages = [] } = threadData?.data?.data || {};

  const handleOnClick = () => {
    setThreadId(threadId ? null : 'test!');
  };

  console.log('isLoading:', myMessagesIsLoading);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  if (myMessagesIsError) {
    return <>{myMessagesError}</>;
  }

  return (
    <Box>
      <Typography variant="h1">
        {t('CommunicationExpandPage - ') + threadId}
      </Typography>
      <button onClick={handleOnClick}>Change threadId</button>
      <Grid container spacing={3}>
        <Grid item size="grow">
          {students?.map((student) => (
            <Typography key={student._id}>{student.firstname}</Typography>
          ))}
        </Grid>
        <Grid item size="grow">
          {studentThreads?.map((thread) => (
            <Typography key={thread._id}>{thread.file_type}</Typography>
          ))}
        </Grid>
        <Grid item size={8}>
          {messages?.map((msgItem) => (
            <Typography key={msgItem._id}>
              {msgItem.message.substring(0, 150)}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DocumentCommunicationExpandPage;
