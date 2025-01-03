import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Checkbox,
    Divider,
    InputBase,
    List,
    ListItem,
    Grid,
    Typography,
    Stack,
    useTheme
} from '@mui/material';
import {
    Search as SearchIcon,
    FiberManualRecord as FiberManualRecordIcon
} from '@mui/icons-material';

import { useAuth } from '../../../../components/AuthProvider';
import { is_TaiGer_role } from '@taiger-common/core';
import DEMO from '../../../../store/constant';
import Loading from '../../../../components/Loading/Loading';

import DocModificationThreadPage from '../DocModificationThreadPage';
import {
    FILE_OK_SYMBOL,
    FILE_MISSING_SYMBOL
} from '../../../../utils/contants';
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

const ThreadItem = ({ thread, onClick }) => {
    const theme = useTheme();
    const isFinal = thread?.isFinalVersion;
    const notRepliedByUser =
        thread.messages?.[0]?.user_id?._id === thread?.student_id;
    return (
        <ListItem
            sx={{
                backgroundColor: !notRepliedByUser
                    ? theme.palette.background.default
                    : theme.palette.action.disabled,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover // Set a different color on hover if needed
                },
                transition: 'background-color 0.3s ease-in-out', // Smooth color transitions
                color: !notRepliedByUser
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary
            }}
            disablePadding
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                {isFinal ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
                <Typography
                    onClick={onClick}
                    sx={{ fontStyle: isFinal ? 'italic' : 'normal' }}
                >
                    {`${thread.file_type}`}
                </Typography>
                {notRepliedByUser && (
                    <FiberManualRecordIcon
                        fontSize="tiny"
                        title="Not Reply Yet"
                    />
                )}
            </Stack>
        </ListItem>
    );
};

function DocumentCommunicationExpandPage() {
    const { threadId: paramThreadId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { t } = useTranslation();
    const [showAllThreads, setShowAllThreads] = useState(true);
    const [threadId, setThreadId] = useState(paramThreadId || null);

    const {
        data: myMessagesData,
        isLoading: myMessagesIsLoading,
        isError: myMessagesIsError,
        error: myMessagesError
    } = useQuery(getMyThreadMessageQuery());

    const { data: threadData } = useQuery(getThreadMessages(threadId));

    const { students = [], studentThreads = [] } =
        myMessagesData?.data?.data || {};

    const thread = threadData?.data?.data || {};
    const { student_id: threadStudent } = thread;
    const [studentId, setStudentId] = useState(null);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

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
            <Typography variant="h5" sx={{ mb: 1 }}>
                {t('CommunicationExpandPage - ') + threadId + ' - ' + studentId}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={1.5}>
                    {myMessagesIsLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <SearchIcon />
                                <InputBase
                                    label="Name"
                                    value={studentSearchTerm}
                                    onChange={(e) =>
                                        setStudentSearchTerm(e.target.value)
                                    }
                                />
                            </Stack>
                            <List>
                                {students
                                    ?.filter((student) => {
                                        return `${student?.firstname} ${student?.lastname}`
                                            .toLowerCase()
                                            .includes(
                                                studentSearchTerm.toLowerCase()
                                            );
                                    })
                                    ?.sort((a, b) =>
                                        a.firstname.localeCompare(b.firstname)
                                    )
                                    ?.map((student) => (
                                        <ListItem
                                            key={student._id}
                                            disablePadding
                                        >
                                            <Typography
                                                onClick={() =>
                                                    handleOnClickStudent(
                                                        student._id
                                                    )
                                                }
                                            >
                                                {student.firstname +
                                                    ' ' +
                                                    student.lastname}
                                            </Typography>
                                        </ListItem>
                                    ))}
                            </List>
                        </>
                    )}
                </Grid>
                <Grid item xs={1.5}>
                    <Checkbox
                        checked={showAllThreads}
                        onChange={() => setShowAllThreads(!showAllThreads)}
                        disabled={sortedThreads.every(
                            (thread) => thread?.isFinalVersion
                        )}
                    />{' '}
                    Show all threads
                    <List>
                        {sortedThreads
                            ?.filter(
                                (thread) =>
                                    showAllThreads || !thread?.isFinalVersion
                            )
                            ?.map((thread) => {
                                const category = getCategory(thread.file_type);
                                const showCategoryLabel =
                                    category !== currentCategory;
                                currentCategory = category;

                                return (
                                    <React.Fragment key={thread._id}>
                                        {showCategoryLabel && (
                                            <Divider
                                                textAlign="center"
                                                sx={{ p: 3 }}
                                            >
                                                {category}
                                            </Divider>
                                        )}
                                        <ThreadItem
                                            thread={thread}
                                            onClick={() =>
                                                handleOnClickThread(thread._id)
                                            }
                                        />
                                    </React.Fragment>
                                );
                            })}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    {threadId && (
                        <DocModificationThreadPage threadId={threadId} />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

export default DocumentCommunicationExpandPage;
