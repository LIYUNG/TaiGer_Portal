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
    staleTime: 1000 * 60 // 1 minutes
});

const getThreadByStudentQuery = (studentId) => ({
    queryKey: ['threadsByStudent', studentId],
    queryFn: async () => {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 10000));
            const response = await getThreadsByStudent(studentId);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 // 1 minutes
});

const StudentItem = ({ student, selectedStudentId, onClick }) => {
    const theme = useTheme();
    const isStudentComplete =
        student?.threadCount === student?.completeThreadCount;
    const highlightItem = !isStudentComplete && student.needToReply;
    return (
        <ListItem
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
            disablePadding
            divider
        >
            <ListItemButton sx={{ paddingY: 0 }} onClick={onClick}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: '100%' }}
                >
                    {isStudentComplete ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
                    <ListItemText
                        primary={
                            <Typography
                                variant="body1"
                                style={{
                                    fontWeight:
                                        student?._id?.toString() ===
                                        selectedStudentId?.toString()
                                            ? 900
                                            : 'normal'
                                }}
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
                    {highlightItem && (
                        <FiberManualRecordIcon
                            fontSize="tiny"
                            title="Not Reply Yet"
                        />
                    )}
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
            disablePadding
        >
            <ListItemButton
                sx={{ paddingY: 0 }}
                onClick={onClick}
                title={programName}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: '100%' }}
                >
                    {isFinal ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
                    <ListItemText
                        primary={
                            <Typography
                                sx={{
                                    fontStyle: isFinal ? 'italic' : 'normal',
                                    flexGrow: 1, // Allow Typography to take available space
                                    whiteSpace: 'nowrap', // Prevent text from wrapping
                                    overflow: 'hidden', // Hide overflow text
                                    textOverflow: 'ellipsis' // Add ellipsis for overflow text
                                }}
                            >
                                {`${thread.file_type}`}
                            </Typography>
                        }
                        secondary={
                            thread?.program_id && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flexGrow: 1, // Allow Typography to take available space
                                        whiteSpace: 'nowrap', // Prevent text from wrapping
                                        overflow: 'hidden', // Hide overflow text
                                        textOverflow: 'ellipsis' // Add ellipsis for overflow text
                                    }}
                                >
                                    {programName}
                                </Typography>
                            )
                        }
                    />

                    {highlightItem && (
                        <FiberManualRecordIcon
                            fontSize="tiny"
                            title="Not Reply Yet"
                        />
                    )}
                </Stack>
            </ListItemButton>
        </ListItem>
    );
};

function DocumentCommunicationExpandPage() {
    const { threadId: paramThreadId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { t } = useTranslation();
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
        navigate(`/doc-communications/${threadId}`);
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
        return <>{studentMetricsError}</>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
                {t('CommunicationExpandPage - ') + threadId + ' - ' + studentId}
            </Typography>

            <Grid container spacing={1.5}>
                <Grid item xs={1.5}>
                    {studentMetricsIsLoading ? (
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
                                            student={student}
                                            selectedStudentId={studentId}
                                            onClick={() => {
                                                handleOnClickStudent(
                                                    student._id
                                                );
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth'
                                                });
                                            }}
                                        />
                                    ))}
                            </List>
                        </>
                    )}
                </Grid>
                <Grid item xs={1.5}>
                    {studentThreadIsLoading && <Loading />}
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
                                            onClick={() => {
                                                handleOnClickThread(thread._id);
                                            }}
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
