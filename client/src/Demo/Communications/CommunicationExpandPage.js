import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as LinkDom, Navigate, useParams } from 'react-router-dom';
import {
    Avatar,
    Box,
    Grid,
    Typography,
    ListItem,
    useMediaQuery,
    useTheme,
    Drawer,
    IconButton,
    CircularProgress,
    Menu,
    Link,
    Stack,
    Tooltip,
    MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { is_TaiGer_role } from '@taiger-common/core';

import { WidgetExportMessagePDF } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import {
    convertDate,
    convertDateUXFriendly,
    stringAvatar
} from '../../utils/contants';
import EmbeddedChatList from '../../components/EmbeddedChatList';
import { FetchStudentLayer } from '../StudentDatabase/FetchStudentLayer';
import CommunicationExpandPageMessagesComponent from './CommunicationExpandPageMessagesComponent';
import { truncateText } from '../Utils/checking-functions';
import { getCommunicationQuery } from '../../api/query';

const StudentDetailModal = ({
    open,
    anchorStudentDetailEl,
    dropdownId,
    handleStudentDetailModalClose,
    student_id
}) => (
    <Menu
        anchorEl={anchorStudentDetailEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id={dropdownId}
        onClose={handleStudentDetailModalClose}
        open={open}
        sx={{
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            height: window.innerHeight
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
        <ListItem sx={{ py: 1 }}>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
            >
                <Box>
                    <FetchStudentLayer studentId={student_id} />
                </Box>
            </Box>
        </ListItem>
    </Menu>
);

const AgentsEditorsModal = ({
    open,
    student,
    agentsEditorsDropdownId,
    anchorAgentsEditorsEl,
    handleAgentsEditorsStudentDetailModalClose
}) => (
    <Menu
        anchorEl={anchorAgentsEditorsEl}
        anchorOrigin={{ horizontal: 'right', vertical: 60 }}
        id={agentsEditorsDropdownId}
        onClose={handleAgentsEditorsStudentDetailModalClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
        {student?.agents?.map((agent) => (
            <MenuItem key={agent._id}>
                {agent.firstname} {agent.lastname}
            </MenuItem>
        ))}
        {student?.editors?.map((editor) => (
            <MenuItem key={editor._id}>
                {editor.firstname} {editor.lastname}
            </MenuItem>
        ))}
    </Menu>
);

const MemorizedStudentDetailModal = React.memo(StudentDetailModal);

const LastLoginRelativeTime = ({ date }) => {
    return <>{convertDateUXFriendly(date)}</>;
};

const LastLoginAbsoluteTime = ({ date }) => {
    return <>{convertDate(date)}</>;
};

const LastLoginTime = ({ date }) => {
    const [view, setView] = useState(false);
    const { t } = useTranslation();

    return (
        <Typography
            color="text.secondary"
            onClick={() => setView(!view)}
            sx={{ ml: 1 }}
            title={t('Last Login', { ns: 'auth' })}
            variant="body2"
        >
            {view ? (
                <LastLoginAbsoluteTime date={date} />
            ) : (
                <LastLoginRelativeTime date={date} />
            )}
        </Typography>
    );
};

const TopBar = ({
    isLoading,
    isExportingMessageDisabled,
    ismobile,
    handleDrawerClose,
    student,
    student_name_english,
    student_id,
    agentsEditorsDropdownId,
    handleAgentsEditorsModalOpen,
    handleExportMessages,
    dropdownId,
    handleStudentDetailModalOpen,
    handleAgentsEditorsModalClose,
    isAgentsEditorsModalOpen
}) => {
    const { t } = useTranslation();
    return (
        !isLoading && (
            <Box
                className="sticky-top"
                sx={{
                    my: 1,
                    display: 'flex'
                }}
            >
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    {ismobile ? (
                        <IconButton
                            aria-label="open drawer"
                            color="inherit"
                            edge="start"
                            onClick={(e) => handleDrawerClose(e)}
                            style={{ marginLeft: '4px' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    ) : null}
                    <Avatar {...stringAvatar(student_name_english)} />
                    <Box>
                        <Link
                            component={LinkDom}
                            to={DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                student_id,
                                DEMO.PROFILE_HASH
                            )}
                        >
                            <Typography
                                fontWeight="bold"
                                sx={{ ml: 1 }}
                                variant="body1"
                            >
                                {truncateText(student_name_english, 24)}
                            </Typography>
                        </Link>
                        <LastLoginTime date={student.lastLoginAt} />
                    </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ mr: 2, md: 'flex' }}>
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <Tooltip title={t('Agents Editors', { ns: 'common' })}>
                            <IconButton
                                aria-controls={agentsEditorsDropdownId}
                                aria-haspopup="true"
                                aria-label="open-more-1"
                                color="inherit"
                                edge="end"
                                onClick={handleAgentsEditorsModalOpen}
                            >
                                <PeopleAltIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Export messages', { ns: 'common' })}>
                            <IconButton
                                aria-controls={dropdownId}
                                aria-haspopup="true"
                                aria-label="open-more"
                                color="inherit"
                                disabled={isExportingMessageDisabled}
                                edge="end"
                                onClick={handleExportMessages}
                            >
                                {isExportingMessageDisabled ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <FileDownloadIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('More', { ns: 'common' })}>
                            <IconButton
                                aria-controls={dropdownId}
                                aria-haspopup="true"
                                aria-label="open-more"
                                color="inherit"
                                edge="end"
                                onClick={handleStudentDetailModalOpen}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
                <AgentsEditorsModal
                    agentsEditorsDropdownId={agentsEditorsDropdownId}
                    anchorAgentsEditorsEl={isAgentsEditorsModalOpen}
                    handleAgentsEditorsStudentDetailModalClose={
                        handleAgentsEditorsModalClose
                    }
                    open={isAgentsEditorsModalOpen}
                    student={student}
                />
            </Box>
        )
    );
};

const CommunicationExpandPage = () => {
    const { student_id } = useParams();
    const { user } = useAuth();
    const theme = useTheme();
    const ismobile = useMediaQuery(theme.breakpoints.down('md'));
    const { data, isLoading } = useQuery(getCommunicationQuery(student_id));
    const student = data?.student;
    const thread = data?.data;
    const APP_BAR_HEIGHT = 64;

    const [open, setOpen] = useState(ismobile);
    const [anchorStudentDetailEl, setAnchorStudentDetailEl] = useState(null);
    const [anchorAgentsEditorsEl, setAnchorAgentsEditorsEl] = useState(null);
    const isStudentDetailModalOpen = Boolean(anchorStudentDetailEl);
    const isAgentsEditorsModalOpen = Boolean(anchorAgentsEditorsEl);
    const [isExportingMessageDisabled, setIsExportingMessageDisabled] =
        useState(false);
    const scrollableRef = useRef(null);
    const scrollToBottom = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTop =
                scrollableRef.current.scrollHeight;
        }
    };

    const handleDrawerOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleStudentDetailModalOpen = (event) => {
        event.stopPropagation();
        setAnchorStudentDetailEl(event.currentTarget);
    };

    const handleAgentsEditorsModalOpen = (event) => {
        setAnchorAgentsEditorsEl(event.currentTarget);
    };

    const handleExportMessages = async (event) => {
        event.stopPropagation();
        setIsExportingMessageDisabled(true);
        const downloadBlob = (blob, filename) => {
            // Create a URL for the Blob data
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Set the download attribute with a filename

            // Append the link to the body
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Clean up by removing the link and revoking the URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        };
        const resp = await WidgetExportMessagePDF(student_id);
        const blob = resp.data;
        downloadBlob(blob, 'exported_file.pdf');
        setIsExportingMessageDisabled(false);
    };

    const handleStudentDetailModalClose = (event) => {
        event.stopPropagation();
        setAnchorStudentDetailEl(null);
    };

    const handleAgentsEditorsModalClose = (event) => {
        event.stopPropagation();
        setAnchorAgentsEditorsEl(null);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const agentsEditorsDropdownId = 'primary-agents-editors-modal';

    const dropdownId = 'primary-student-modal';

    scrollToBottom();

    const student_name =
        !isLoading &&
        `${student.firstname} ${student.lastname} ${
            student.firstname_chinese ? student.firstname_chinese : ''
        } ${student.lastname_chinese ? student.lastname_chinese : ''}`;
    const student_name_english =
        !isLoading && `${student.firstname} ${student.lastname}`;

    TabTitle(`${student_name}`);
    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    return (
        <Box
            style={{
                marginLeft: '-24px',
                marginRight: '-18px',
                marginTop: '-24px',
                marginBottom: '-24px'
            }}
        >
            <Grid container spacing={0}>
                <Grid
                    item
                    md="auto" // Let it auto-size on medium screens and up
                    sx={{
                        maxHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
                        overflowY: 'auto',
                        display: { xs: 'none', md: 'flex' }
                    }}
                    xs={12} // Full width on extra small screens
                >
                    <Box
                        sx={{
                            maxWidth: '300px' // Responsive width
                        }}
                    >
                        <EmbeddedChatList student_id={student_id} />
                    </Box>
                </Grid>
                <Grid item md xs={12}>
                    {ismobile ? (
                        <Drawer
                            anchor="right"
                            open={open}
                            sx={{
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: '100%', // Make Drawer full width on small screens
                                    maxWidth: '100vw'
                                }
                            }}
                            variant="temporary"
                        >
                            <TopBar
                                agentsEditorsDropdownId={
                                    agentsEditorsDropdownId
                                }
                                handleAgentsEditorsModalClose={
                                    handleAgentsEditorsModalClose
                                }
                                handleAgentsEditorsModalOpen={
                                    handleAgentsEditorsModalOpen
                                }
                                handleDrawerClose={handleDrawerClose}
                                handleExportMessages={handleExportMessages}
                                handleStudentDetailModalOpen={
                                    handleStudentDetailModalOpen
                                }
                                isAgentsEditorsModalOpen={
                                    isAgentsEditorsModalOpen
                                }
                                isExportingMessageDisabled={
                                    isExportingMessageDisabled
                                }
                                isLoading={isLoading}
                                ismobile={ismobile}
                                student={student}
                                student_id={student_id}
                                student_name_english={student_name_english}
                            />
                            {student_id ? (
                                isLoading ? (
                                    <Loading />
                                ) : (
                                    <Box
                                        ref={scrollableRef}
                                        sx={{
                                            height: `calc(100vh - ${APP_BAR_HEIGHT - 8}px)`, // Subtract header
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <CommunicationExpandPageMessagesComponent
                                            data={thread}
                                            student={student}
                                            student_id={student_id}
                                        />
                                    </Box>
                                )
                            ) : null}
                        </Drawer>
                    ) : null}
                    {!ismobile && student_id ? (
                        isLoading ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}
                            >
                                <Loading />
                            </Box>
                        ) : (
                            <Box>
                                <TopBar
                                    agentsEditorsDropdownId={
                                        agentsEditorsDropdownId
                                    }
                                    handleAgentsEditorsModalClose={
                                        handleAgentsEditorsModalClose
                                    }
                                    handleAgentsEditorsModalOpen={
                                        handleAgentsEditorsModalOpen
                                    }
                                    handleDrawerClose={handleDrawerClose}
                                    handleExportMessages={handleExportMessages}
                                    handleStudentDetailModalOpen={
                                        handleStudentDetailModalOpen
                                    }
                                    isAgentsEditorsModalOpen={
                                        isAgentsEditorsModalOpen
                                    }
                                    isExportingMessageDisabled={
                                        isExportingMessageDisabled
                                    }
                                    isLoading={isLoading}
                                    ismobile={ismobile}
                                    student={student}
                                    student_id={student_id}
                                    student_name_english={student_name_english}
                                />
                                <Box
                                    ref={scrollableRef}
                                    style={{
                                        height: `calc(100vh - ${APP_BAR_HEIGHT + 60}px)`, // Subtract header
                                        overflowY:
                                            'auto' /* Enable vertical scrolling */
                                    }}
                                >
                                    <CommunicationExpandPageMessagesComponent
                                        data={thread}
                                        student={student}
                                        student_id={student_id}
                                    />
                                </Box>
                            </Box>
                        )
                    ) : null}
                    {!student_id ? <Typography>Empty</Typography> : null}
                    {ismobile ? (
                        <Box
                            onClick={(e) => handleDrawerOpen(e)}
                            sx={{
                                display: { md: 'flex' },
                                maxHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
                                overflow: 'auto' // Prevent parent scroll
                            }}
                        >
                            <EmbeddedChatList student_id={student_id} />
                        </Box>
                    ) : null}
                </Grid>
                <Box sx={{ marginLeft: 0 }}>
                    <MemorizedStudentDetailModal
                        anchorStudentDetailEl={anchorStudentDetailEl}
                        dropdownId={dropdownId}
                        handleStudentDetailModalClose={
                            handleStudentDetailModalClose
                        }
                        open={isStudentDetailModalOpen}
                        student_id={student_id}
                    />
                </Box>
            </Grid>
        </Box>
    );
};

export default CommunicationExpandPage;
