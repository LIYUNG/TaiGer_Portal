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
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { is_TaiGer_role } from '@taiger-common/core';

import { getCommunicationThread, WidgetExportMessagePDF } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import {
  convertDate,
  convertDate_ux_friendly,
  stringAvatar
} from '../Utils/contants';
import MemoizedEmbeddedChatList from '../../components/EmbeddedChatList';
import { FetchStudentLayer } from '../StudentDatabase/FetchStudentLayer';
import CommunicationExpandPageMessagesComponent from './CommunicationExpandPageMessagesComponent';
import ErrorPage from '../Utils/ErrorPage';

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
      height: window.innerHeight - 56
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
const MemorizedStudentDetailModal = React.memo(StudentDetailModal);

const LastLoginTime = ({ date }) => {
  const [view, setView] = useState(false);
  const { t } = useTranslation();
  const LastLoginRelativeTime = ({ date }) => {
    return <>{convertDate_ux_friendly(date)}</>;
  };

  const LastLoginAbsoluteTime = ({ date }) => {
    return <>{convertDate(date)}</>;
  };

  return (
    <Box onClick={() => setView(!view)} title={t('Last Login', { ns: 'auth' })}>
      {view ? (
        <LastLoginAbsoluteTime date={date} />
      ) : (
        <LastLoginRelativeTime date={date} />
      )}
    </Box>
  );
};

function CommunicationExpandPage() {
  const { student_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const ismobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const [open, setOpen] = useState(false);
  const [anchorStudentDetailEl, setAnchorStudentDetailEl] = useState(null);
  const isStudentDetailModalOpen = Boolean(anchorStudentDetailEl);
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

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const DrawerChatMemo = () => {
    return (
      <MemoizedEmbeddedChatList count={communicationExpandPageState.count} />
    );
  };

  const dropdownId = 'primary-student-modal';

  const { messagesLoaded, student, isLoaded, res_status } =
    communicationExpandPageState;

  if (!isLoaded && !communicationExpandPageState.thread) {
    return <Loading />;
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
  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <Box
      onClick={() => {
        handleDrawerClose();
      }}
      style={{
        marginLeft: '-24px',
        marginRight: '-18px',
        marginTop: '-18px',
        marginBottom: '-24px'
      }}
    >
      <Grid container>
        <Grid
          item
          style={{ width: '300px' }}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <div
              style={{
                height: window.innerHeight - 70,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  overflowY: 'auto' /* Enable vertical scrolling */,
                  maxHeight:
                    window.innerHeight -
                    70 /* Adjusted max height, considering header */
                }}
              >
                <MemoizedEmbeddedChatList
                  count={communicationExpandPageState.count}
                />
              </div>
            </div>
          </Box>
        </Grid>
        <Grid item xs md>
          <Box
            className="sticky-top"
            sx={{
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
                  onClick={(e) => handleDrawerOpen(e)}
                  edge="start"
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Avatar {...stringAvatar(student_name_english)}></Avatar>
              <Link
                to={DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  student_id,
                  DEMO.PROFILE_HASH
                )}
                component={LinkDom}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ ml: 1, mt: 1 }}
                >
                  {student_name_english}
                </Typography>
              </Link>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ mr: 2, md: 'flex' }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={0}
              >
                <LastLoginTime date={student.lastLoginAt} />
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
                      <ExitToAppIcon />
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
          </Box>
          <Drawer
            sx={{
              width: '300px',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '300px',
                boxSizing: 'border-box'
              }
            }}
            open={open}
            variant="temporary"
            anchor="left"
          >
            <DrawerChatMemo />
          </Drawer>
          {!student_id && <Typography>Empty</Typography>}
          {student_id &&
            (messagesLoaded ? (
              <div
                style={{
                  height: window.innerHeight - 70 - 40,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    overflowY: 'auto' /* Enable vertical scrolling */,
                    maxHeight:
                      window.innerHeight -
                      70 -
                      40 /* Adjusted max height, considering header */
                  }}
                  ref={scrollableRef}
                >
                  <CommunicationExpandPageMessagesComponent
                    student={communicationExpandPageState.student}
                    data={communicationExpandPageState.thread}
                    student_id={student_id}
                  />
                </div>
              </div>
            ) : (
              <CircularProgress />
            ))}
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
