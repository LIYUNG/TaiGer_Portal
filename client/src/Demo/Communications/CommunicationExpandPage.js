import React, { useEffect, useRef, useState } from 'react';
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

import { getCommunicationThread, WidgetExportMessagePDF } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import {
  convertDate,
  convertDateUXFriendly,
  stringAvatar
} from '../Utils/contants';
import MemoizedEmbeddedChatList from '../../components/EmbeddedChatList';
import { FetchStudentLayer } from '../StudentDatabase/FetchStudentLayer';
import CommunicationExpandPageMessagesComponent from './CommunicationExpandPageMessagesComponent';
import ErrorPage from '../Utils/ErrorPage';
import { truncateText } from '../Utils/checking-functions';

const StudentDetailModal = ({
  open,
  anchorStudentDetailEl,
  dropdownId,
  handleStudentDetailModalClose,
  student_id
}) => (
  <Menu
    anchorEl={anchorStudentDetailEl}
    id={dropdownId}
    open={open}
    onClose={handleStudentDetailModalClose}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    sx={{
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      height: window.innerHeight
    }}
  >
    <ListItem sx={{ py: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
    id={agentsEditorsDropdownId}
    open={open}
    onClose={handleAgentsEditorsStudentDetailModalClose}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 60 }}
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

const LastLoginTime = ({ date }) => {
  const [view, setView] = useState(false);
  const { t } = useTranslation();
  const LastLoginRelativeTime = ({ date }) => {
    return <>{convertDateUXFriendly(date)}</>;
  };

  const LastLoginAbsoluteTime = ({ date }) => {
    return <>{convertDate(date)}</>;
  };

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      onClick={() => setView(!view)}
      title={t('Last Login', { ns: 'auth' })}
      sx={{ ml: 1 }}
    >
      {view ? (
        <LastLoginAbsoluteTime date={date} />
      ) : (
        <LastLoginRelativeTime date={date} />
      )}
    </Typography>
  );
};

function CommunicationExpandPage() {
  const { student_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const ismobile = useMediaQuery(theme.breakpoints.down('md'));
  const APP_BAR_HEIGHT = 64;
  const [communicationExpandPageState, setCommunicationExpandPageState] =
    useState({
      error: '',
      isLoaded: false,
      messagesLoaded: false,
      thread: null,
      count: 1,
      editorState: {},
      files: [],
      expand: true,
      pageNumber: 1,
      uppderaccordionKeys: [], // to expand all]
      accordionKeys: [0], // to expand all]
      loadButtonDisabled: false,
      res_status: 0,
      res_modal_status: 0,
      res_modal_message: ''
    });

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
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!student_id) {
      setCommunicationExpandPageState((prevState) => ({
        ...prevState,
        isLoaded: true
      }));
    }
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      messagesLoaded: false
    }));
    getCommunicationThread(student_id).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            success,
            thread: data,
            messagesLoaded: true,
            isLoaded: true,
            count: prevState.count + 1,
            student_id: student_id,
            student,
            accordionKeys: new Array(data.length)
              .fill()
              .map((x, i) => (i >= data.length - 2 ? i : -1)), // only expand latest 2
            res_status: status
          }));
          scrollToBottom();
        } else {
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            count: prevState.count + 1,
            messagesLoaded: true,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setCommunicationExpandPageState((prevState) => ({
          ...prevState,
          count: prevState.count + 1,
          messagesLoaded: true,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [student_id]);

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

  const countIncrease = () => {
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      count: prevState.count + 1
    }));
  };

  const agentsEditorsDropdownId = 'primary-agents-editors-modal';

  const TopBar = () => {
    return (
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
          {ismobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              style={{ marginLeft: '4px' }}
              onClick={(e) => handleDrawerClose(e)}
              edge="start"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar {...stringAvatar(student_name_english)}></Avatar>
          <Box>
            <Link
              to={DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                student_id,
                DEMO.PROFILE_HASH
              )}
              component={LinkDom}
            >
              <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                {truncateText(student_name_english, 24)}
              </Typography>
            </Link>
            <LastLoginTime date={student.lastLoginAt} />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ mr: 2, md: 'flex' }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Tooltip title={t('Agents Editors', { ns: 'common' })}>
              <IconButton
                color="inherit"
                aria-label="open-more-1"
                aria-controls={agentsEditorsDropdownId}
                aria-haspopup="true"
                edge="end"
                onClick={handleAgentsEditorsModalOpen}
              >
                <PeopleAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Export messages', { ns: 'common' })}>
              <IconButton
                color="inherit"
                aria-label="open-more"
                aria-controls={dropdownId}
                aria-haspopup="true"
                onClick={handleExportMessages}
                edge="end"
                disabled={isExportingMessageDisabled}
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
                color="inherit"
                aria-label="open-more"
                aria-controls={dropdownId}
                aria-haspopup="true"
                onClick={handleStudentDetailModalOpen}
                edge="end"
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <AgentsEditorsModal
          open={isAgentsEditorsModalOpen}
          student={student}
          agentsEditorsDropdownId={agentsEditorsDropdownId}
          anchorAgentsEditorsEl={isAgentsEditorsModalOpen}
          handleAgentsEditorsStudentDetailModalClose={
            handleAgentsEditorsModalClose
          }
        />
      </Box>
    );
  };
  // const DrawerChatMemo = () => {
  //   return (
  //     <MemoizedEmbeddedChatList count={communicationExpandPageState.count} />
  //   );
  // };

  const dropdownId = 'primary-student-modal';

  const { messagesLoaded, student, isLoaded, res_status } =
    communicationExpandPageState;

  if (!isLoaded && !communicationExpandPageState.thread) {
    return <></>;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const student_name = `${student.firstname} ${student.lastname} ${
    student.firstname_chinese ? student.firstname_chinese : ''
  } ${student.lastname_chinese ? student.lastname_chinese : ''}`;
  const student_name_english = `${student.firstname} ${student.lastname}`;

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
          xs={12} // Full width on extra small screens
          md="auto" // Let it auto-size on medium screens and up
          sx={{
            maxHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
            overflowY: 'auto',
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Box
            sx={{
              maxWidth: '300px' // Responsive width
            }}
          >
            <MemoizedEmbeddedChatList
              count={communicationExpandPageState.count}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md>
          {ismobile && (
            <Drawer
              sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: '100%', // Make Drawer full width on small screens
                  maxWidth: '100vw'
                }
              }}
              open={open}
              variant="temporary"
              anchor="right"
            >
              <TopBar />
              {student_id &&
                (messagesLoaded ? (
                  <Box
                    sx={{
                      height: `calc(100vh - ${APP_BAR_HEIGHT - 8}px)`, // Subtract header
                      overflowY: 'auto'
                    }}
                    ref={scrollableRef}
                  >
                    <CommunicationExpandPageMessagesComponent
                      student={communicationExpandPageState.student}
                      data={communicationExpandPageState.thread}
                      student_id={student_id}
                      countIncrease={countIncrease}
                    />
                  </Box>
                ) : (
                  <Loading />
                ))}
            </Drawer>
          )}
          {!ismobile &&
            student_id &&
            (messagesLoaded ? (
              <Box>
                <TopBar />
                <Box
                  style={{
                    height: `calc(100vh - ${APP_BAR_HEIGHT + 60}px)`, // Subtract header
                    overflowY: 'auto' /* Enable vertical scrolling */
                  }}
                  ref={scrollableRef}
                >
                  <CommunicationExpandPageMessagesComponent
                    student={communicationExpandPageState.student}
                    data={communicationExpandPageState.thread}
                    student_id={student_id}
                    countIncrease={countIncrease}
                  />
                </Box>
              </Box>
            ) : (
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
            ))}
          {!student_id && <Typography>Empty</Typography>}
          {ismobile && (
            <Box
              sx={{
                display: { md: 'flex' },
                maxHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
                overflow: 'auto' // Prevent parent scroll
              }}
              onClick={(e) => handleDrawerOpen(e)}
            >
              <MemoizedEmbeddedChatList
                count={communicationExpandPageState.count}
              />
            </Box>
          )}
        </Grid>
        <Box sx={{ marginLeft: 0 }}>
          <MemorizedStudentDetailModal
            open={isStudentDetailModalOpen}
            anchorStudentDetailEl={anchorStudentDetailEl}
            dropdownId={dropdownId}
            handleStudentDetailModalClose={handleStudentDetailModalClose}
            student_id={student_id}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default CommunicationExpandPage;
