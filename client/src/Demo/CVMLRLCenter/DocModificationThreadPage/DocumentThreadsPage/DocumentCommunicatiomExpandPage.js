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
import { getMyThreadMessages } from '../../../../api';

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

const ThreadItem = ({ thread, onClick }) => {
    const theme = useTheme();
    const isFinal = thread?.isFinalVersion;
    const notRepliedByUser =
        thread.messages?.[0]?.user_id?._id === thread?.student_id;
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
            <ListItemButton sx={{ paddingY: 0 }} onClick={onClick}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: '100%' }}
                >
                    {isFinal ? FILE_OK_SYMBOL : FILE_MISSING_SYMBOL}
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
        data: myMessagesData,
        isLoading: myMessagesIsLoading,
        isError: myMessagesIsError,
        error: myMessagesError
    } = useQuery(getMyThreadMessageQuery());

    const { students = [], studentThreads = [] } =
        myMessagesData?.data?.data || {};

    useEffect(() => {
        if (!threadId) {
            return;
        }
        navigate(`/doc-communications/${threadId}`);
        // get student id from thread information
        const studentId = studentThreads?.find(
            (thread) => thread._id === threadId
        )?.student_id;
        setStudentId(studentId);
    }, [threadId, navigate, studentThreads]);

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
                                            <ListItemButton
                                                sx={{ paddingY: 0 }}
                                                onClick={() =>
                                                    handleOnClickStudent(
                                                        student._id
                                                    )
                                                }
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body1"
                                                            style={{
                                                                fontWeight:
                                                                    student?._id?.toString() ===
                                                                    studentId
                                                                        ? 900
                                                                        : 'normal'
                                                            }}
                                                        >
                                                            {`${student.firstname} ${student.lastname}`}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
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
