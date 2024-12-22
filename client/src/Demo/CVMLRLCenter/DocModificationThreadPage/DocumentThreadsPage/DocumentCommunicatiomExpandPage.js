import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { Box, Grid, Typography } from '@mui/material';

import { useAuth } from '../../../../components/AuthProvider';
import { is_TaiGer_role } from '@taiger-common/core';
import DEMO from '../../../../store/constant';
import Loading from '../../../../components/Loading/Loading';

import MessageList from '../../../../components/Message/MessageList';
import { getMyThreadMessages, getMessagThread } from '../../../../api';

const getMyThreadMessageQuery = () => ({
  queryKey: ['myThreadMessages'],
  queryFn: async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 10000));
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
  const [threadId, setThreadId] = useState(paramThreadId || null);

  const {
    data: myMessagesData,
    isLoading: myMessagesIsLoading,
    isError: myMessagesIsError,
    error: myMessagesError
  } = useQuery(getMyThreadMessageQuery());

  const {
    data: threadData,
    isLoading: threadIsLoading
    // isError: threadIsError,
    // error: threadError
  } = useQuery(getThreadMessages(threadId));

  const { students = [], studentThreads = [] } =
    myMessagesData?.data?.data || {};

  const { messages = [], student_id: threadStudent = {} } =
    threadData?.data?.data || {};

  const thread = threadData?.data?.data || {};
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (threadStudent?._id) {
      setStudentId(threadStudent._id);
    }
  }, [threadStudent]);

  const handleOnClick = () => {
    setThreadId(threadId ? null : 'test!');
  };

  const handleOnClickStudent = (id) => {
    setStudentId(id);
    setThreadId(null);
  };

  const handleOnClickThread = (id) => {
    setThreadId(id);
  };

  console.log('threadData?.data?.data:', threadData?.data?.data);
  console.log('studentThreads:', studentThreads);

  console.log('isLoading:', myMessagesIsLoading);
  console.log('messages:', messages);

  console.log('thread: ', thread);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  if (myMessagesIsError) {
    return <>{myMessagesError}</>;
  }

  return (
    <Box>
      <Typography variant="h1">
        {t('CommunicationExpandPage - ') + threadId + ' - ' + studentId}
      </Typography>
      <button onClick={handleOnClick}>Change threadId</button>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={1}>
          {myMessagesIsLoading ? (
            <Loading />
          ) : (
            students?.map((student) => (
              <Typography
                key={student._id}
                onClick={() => handleOnClickStudent(student._id)}
              >
                {student.firstname}
              </Typography>
            ))
          )}
        </Grid>
        <Grid item xs={1}>
          {studentThreads
            ?.filter((thread) => thread?.student_id === studentId)
            ?.map((thread) => (
              <Typography
                key={thread._id}
                onClick={() => handleOnClickThread(thread._id)}
              >
                {thread.file_type}
              </Typography>
            ))}
        </Grid>
        <Grid item xs={10}>
          <Box>
            <MessageList
              isLoading={!threadIsLoading}
              documentsthreadId={threadId}
              thread={thread}
              apiPrefix={'/api/document-threads'}
              accordionKeys={new Array(thread?.messages?.length)
                .fill()
                .map((x, i) => (i === thread?.messages?.length - 1 ? i : -1))}
            />
          </Box>

          {/* {messages?.map((msgItem) => (
            <Typography key={msgItem._id}>
              {msgItem.message.substring(0, 150)}
            </Typography>
          ))} */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DocumentCommunicationExpandPage;
