/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { Box, Divider, Grid, Typography } from '@mui/material';

import { useAuth } from '../../../../components/AuthProvider';
import { is_TaiGer_role } from '@taiger-common/core';
import DEMO from '../../../../store/constant';
import Loading from '../../../../components/Loading/Loading';

import DocModificationThreadPage from '../DocModificationThreadPage';

// import MessageList from '../../../../components/Message/MessageList';
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
  const navigate = useNavigate();

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

  const thread = threadData?.data?.data || {};
  const { student_id: threadStudent } = thread;
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (threadStudent?._id) {
      setStudentId(threadStudent._id);
    }
  }, [threadStudent]);

  useEffect(() => {
    if (threadId) {
      navigate(`/doc-communications/${threadId}`);
    }
  }, [threadId, navigate]);

  const handleOnClickStudent = (id) => {
    setStudentId(id);
    setThreadId(null);
  };

  const handleOnClickThread = (id) => {
    setThreadId(id);
  };

  const categories = {
    General: [
      'CV',
      'Recommendation_Letter_A',
      'Recommendation_Letter_B',
      'Recommendation_Letter_C'
    ],
    Editors: ['ML', 'RL_A', 'RL_B', 'RL_C', 'Essay'],
    Others: [
      'Interview',
      'Others',
      'Internship_Form',
      'Scholarship_Form',
      'Portfolio'
    ],
    Agents: ['Supplementary_Form', 'Curriculum_Analysis']
  };

  const getCategory = (fileType) => {
    for (const [category, types] of Object.entries(categories)) {
      if (types.includes(fileType)) {
        return category;
      }
    }
    return 'Others'; // Default category if not found
  };

  const sortedThreads = studentThreads
    ?.filter((thread) => thread?.student_id === studentId)
    ?.sort((a, b) => {
      const categoryA = getCategory(a.file_type);
      const categoryB = getCategory(b.file_type);
      if (categoryA === categoryB) {
        return a.file_type.localeCompare(b.file_type);
      }
      return (
        Object.keys(categories).indexOf(categoryA) -
        Object.keys(categories).indexOf(categoryB)
      );
    });

  let currentCategory = '';

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

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={1.5}>
          {myMessagesIsLoading ? (
            <Loading />
          ) : (
            students
              ?.sort((a, b) => a.firstname.localeCompare(b.firstname))
              ?.map((student) => (
                <Typography
                  key={student._id}
                  onClick={() => handleOnClickStudent(student._id)}
                >
                  {student.firstname + ' ' + student.lastname}
                </Typography>
              ))
          )}
        </Grid>
        <Grid item xs={1.5}>
          {sortedThreads?.map((thread) => {
            const isFinal = thread?.isFinalVersion;
            const category = getCategory(thread.file_type);
            const showCategoryLabel = category !== currentCategory;
            currentCategory = category;

            return (
              <React.Fragment key={thread._id}>
                {showCategoryLabel && (
                  <Divider textAlign="center" sx={{ p: 3 }}>
                    {category}
                  </Divider>
                )}
                <Typography
                  onClick={() => handleOnClickThread(thread._id)}
                  sx={{ fontStyle: isFinal ? 'italic' : 'normal' }}
                >
                  {`${thread.file_type}`}
                </Typography>
              </React.Fragment>
            );
          })}
        </Grid>
        <Grid item xs={9}>
          {/* <Box>
            <MessageList
              isLoading={!threadIsLoading}
              documentsthreadId={threadId}
              thread={thread}
              apiPrefix={'/api/document-threads'}
              accordionKeys={new Array(thread?.messages?.length)
                .fill()
                .map((x, i) => (i === thread?.messages?.length - 1 ? i : -1))}
            />
          </Box> */}

          <DocModificationThreadPage threadId={threadId} />

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
