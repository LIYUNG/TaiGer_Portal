import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Checkbox,
    Divider,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
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
import {
    getMyStudentThreadMetrics,
    getThreadsByStudent
} from '../../../../api';

const categories = {
    General: [
        'CV',
        'Recommendation_Letter_A',
        'Recommendation_Letter_B',
        'Recommendation_Letter_C'
    ],
    RL: ['RL_A', 'RL_B', 'RL_C'],
    ML: ['ML'],
    Essay: ['Essay'],
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

const getStudentMetricsQuery = () => ({
    queryKey: ['myStudentThreadMetrics'],
    queryFn: async () => {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 10000));
            const response = await getMyStudentThreadMetrics();
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    staleTime: 1000 * 60, // 1 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
});

const getThreadByStudentQuery = (studentId) => ({
    queryKey: ['threadsByStudent', studentId],
    queryFn: async () => {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 10000));
            console.log('Fetching threads for student:', studentId);
            const response = await getThreadsByStudent(studentId);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    enabled: !!studentId,
    staleTime: 1000 * 60, // 1 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
});

const StudentItem = ({ student, selectedStudentId, onClick }) => {
    const theme = useTheme();
    const isStudentComplete =
        student?.threadCount === student?.completeThreadCount;
    const highlightItem = !isStudentComplete && student.needToReply;
    return (
        <ListItem
            disablePadding
            divider
            sx={{
                backgroundColor: !highlightItem
                    ? theme.palette.background.default
                    : theme.palette.action.disabled,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover // Set a different color on hover if needed
                },
                transition: 'background-color 0.3s ease-in-out',
                color: !highlightItem
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                width: '100%'
            }}
        >
            <ListItemButton onClick={onClick} sx={{ paddingY: 0 }}>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    sx={{ width: '100%' }}
                >
                    {isStudentComplete ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
                    <ListItemText
                        primary={
                            <Typography
                                style={{
                                    fontWeight:
                                        student?._id?.toString() ===
                                        selectedStudentId?.toString()
                                            ? 900
                                            : 'normal'
                                }}
                                variant="body1"
                            >
                                {`${student.firstname} ${student.lastname}`}
                            </Typography>
                        }
                        secondary={
                            <Typography variant="body2">
                                {`${student?.completeThreadCount}/${student?.threadCount}`}
                            </Typography>
                        }
                    />
                    {highlightItem ? (
                        <FiberManualRecordIcon
                            fontSize="tiny"
                            title="Not Reply Yet"
                        />
                    ) : null}
                </Stack>
            </ListItemButton>
        </ListItem>
    );
};

const ThreadItem = ({ thread, onClick }) => {
    const theme = useTheme();
    const isFinal = thread?.isFinalVersion;
    const programName = thread?.program_id
        ? `${thread?.program_id?.school} - ${thread?.program_id?.program_name}`
        : '';
    const notRepliedByUser =
        thread.messages?.[0]?.user_id === thread?.student_id;
    const highlightItem = !isFinal && notRepliedByUser;
    return (
        <ListItem
            disablePadding
            sx={{
                backgroundColor: !highlightItem
                    ? theme.palette.background.default
                    : theme.palette.action.disabled,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover // Set a different color on hover if needed
                },
                transition: 'background-color 0.3s ease-in-out',
                color: !highlightItem
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                width: '100%'
            }}
        >
            <ListItemButton
                onClick={onClick}
                sx={{ paddingY: 0 }}
                title={programName}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    sx={{ width: '100%' }}
                >
                    {isFinal ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
                    <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    fontStyle: isFinal ? 'italic' : 'normal',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {`${thread.file_type}`}
                            </Typography>
                        }
                        secondary={
                            thread?.program_id ? (
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    variant="body2"
                                >
                                    {programName}
                                </Typography>
                            ) : null
                        }
                    />

                    {highlightItem ? (
                        <FiberManualRecordIcon
                            fontSize="tiny"
                            title="Not Reply Yet"
                        />
                    ) : null}
                </Stack>
            </ListItemButton>
        </ListItem>
    );
};

const DocumentCommunicationExpandPage = () => {
    const { threadId: paramThreadId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    // const { t } = useTranslation();
    const [showAllThreads, setShowAllThreads] = useState(true);
    const [studentId, setStudentId] = useState(null);
    const [threadId, setThreadId] = useState(paramThreadId || null);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

    const {
        data: studentMetricsData,
        isLoading: studentMetricsIsLoading,
        isError: studentMetricsIsError,
        error: studentMetricsError
    } = useQuery(getStudentMetricsQuery());

    const { students = [] } = studentMetricsData?.data?.data || {};

    const { data: studentThreadsData, isLoading: studentThreadIsLoading } =
        useQuery(getThreadByStudentQuery(studentId));
    const { threads: studentThreads = [] } =
        studentThreadsData?.data?.data || {};

    useEffect(() => {
        if (!threadId) {
            return;
        }
        navigate(`/doc-communications/${threadId}`, { replace: true });
        // get student id by thread id
        const studentId = students?.find((student) =>
            student?.threads?.includes(threadId)
        )?._id;
        setStudentId(studentId);
    }, [students, threadId, navigate]);

    useEffect(() => {
        if (!studentId) {
            return;
        }
        const firstThreadId = students?.find(
            (student) => student._id === studentId
        )?.threads?.[0];
        setThreadId(firstThreadId);
    }, [studentId]);

    const handleOnClickStudent = (id) => {
        if (id === studentId) {
            return;
        }
        setStudentId(id);
        setThreadId(null);
    };

    const handleOnClickThread = (id) => {
        setThreadId(id);
    };

    const sortedThreads = studentThreads
        ?.filter((thread) => thread?.student_id === studentId)
        ?.sort((a, b) => {
            const categoryA = getCategory(a.file_type);
            const categoryB = getCategory(b.file_type);
            if (categoryA === categoryB) {
                if (a.file_type === b.file_type) {
                    // Sort by isFinalVersion, false first then true
                    return a.isFinalVersion - b.isFinalVersion;
                }
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

    if (studentMetricsIsError) {
        return studentMetricsError;
    }

    return (
        <Box>
            <Grid container spacing={1.5}>
                <Grid item xs={1.5}>
                    {studentMetricsIsLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={1}
                            >
                                <SearchIcon />
                                <InputBase
                                    onChange={(e) =>
                                        setStudentSearchTerm(e.target.value)
                                    }
                                    value={studentSearchTerm}
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
                                    ?.sort((a, b) => {
                                        const isAcompleted =
                                            a.threadCount ===
                                            a.completeThreadCount;
                                        const isBcompleted =
                                            b.threadCount ===
                                            b.completeThreadCount;
                                        if (a.needToReply !== b.needToReply) {
                                            return a.needToReply ? -1 : 1;
                                        }
                                        if (isAcompleted !== isBcompleted) {
                                            return isAcompleted ? 1 : -1;
                                        }
                                        return a.firstname.localeCompare(
                                            b.firstname
                                        );
                                    })
                                    ?.map((student) => (
                                        <StudentItem
                                            key={student._id}
                                            onClick={() => {
                                                handleOnClickStudent(
                                                    student._id
                                                );
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth'
                                                });
                                            }}
                                            selectedStudentId={studentId}
                                            student={student}
                                        />
                                    ))}
                            </List>
                        </>
                    )}
                </Grid>
                <Grid item xs={2.5}>
                    {studentThreadIsLoading ? <Loading /> : null}
                    <Checkbox
                        checked={showAllThreads}
                        disabled={sortedThreads.every(
                            (thread) => thread?.isFinalVersion
                        )}
                        onChange={() => setShowAllThreads(!showAllThreads)}
                    />{' '}
                    Show completed threads
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
                                        {showCategoryLabel ? (
                                            <Divider
                                                sx={{
                                                    paddingX: 3,
                                                    paddingY: 1
                                                }}
                                                textAlign="center"
                                            >
                                                {category}
                                            </Divider>
                                        ) : null}
                                        <ThreadItem
                                            onClick={() => {
                                                handleOnClickThread(thread._id);
                                            }}
                                            thread={thread}
                                        />
                                    </React.Fragment>
                                );
                            })}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    {threadId ? (
                        <DocModificationThreadPage
                            isEmbedded
                            threadId={threadId}
                        />
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentCommunicationExpandPage;
