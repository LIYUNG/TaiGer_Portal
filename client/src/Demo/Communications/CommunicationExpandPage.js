import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link as LinkDom, Navigate, useParams } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import {
  Avatar,
  Box,
  Card,
  Button,
  Link,
  Grid,
  Typography,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import MessageList from './MessageList';
import CommunicationThreadEditor from './CommunicationThreadEditor';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  getCommunicationThread,
  postCommunicationThread,
  deleteAMessageInCommunicationThread,
  loadCommunicationThread
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { is_TaiGer_Student, is_TaiGer_role } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { stringAvatar } from '../Utils/contants';
import MemoizedEmbeddedChatList from '../../components/EmbeddedChatList';

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
      upperThread: [],
      buttonDisabled: false,
      editorState: {},
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
  const scrollableRef = useRef(null);
  const scrollToBottom = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  };
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowInnerWidth]);

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
            thread: data.reverse(),
            upperThread: [],
            messagesLoaded: true,
            isLoaded: true,
            count: prevState.count + 1,
            student_id: student_id,
            student,
            // accordionKeys: new Array(data.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
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

  const ConfirmError = () => {
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const handleLoadMessages = () => {
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      loadButtonDisabled: true
    }));
    loadCommunicationThread(
      student_id,
      communicationExpandPageState.pageNumber + 1
    ).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            success,
            upperThread: [
              ...data.reverse(),
              ...communicationExpandPageState.upperThread
            ],
            messagesLoaded: true,
            count: prevState.count + 1,
            student,
            pageNumber: communicationExpandPageState.pageNumber + 1,
            uppderaccordionKeys: [
              ...new Array(
                communicationExpandPageState.uppderaccordionKeys.length
              )
                .fill()
                .map((x, i) => i),
              ...new Array(data.length)
                .fill()
                .map((x, i) =>
                  communicationExpandPageState.uppderaccordionKeys !== -1
                    ? i +
                      communicationExpandPageState.uppderaccordionKeys.length
                    : -1
                )
            ],
            loadButtonDisabled: data.length === 0 ? true : false,
            res_status: status
          }));
        } else {
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            count: prevState.count + 1,
            messagesLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setCommunicationExpandPageState((prevState) => ({
          ...prevState,
          count: prevState.count + 1,
          messagesLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      buttonDisabled: true
    }));
    var message = JSON.stringify(editorState);

    postCommunicationThread(
      communicationExpandPageState.student._id.toString(),
      message
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            success,
            count: prevState.count + 1,
            editorState: {},
            thread: [...communicationExpandPageState.thread, ...data],
            messagesLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...communicationExpandPageState.accordionKeys,
              communicationExpandPageState.accordionKeys.length
            ],
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            messagesLoaded: true,
            count: prevState.count + 1,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCommunicationExpandPageState((prevState) => ({
          ...prevState,
          messagesLoaded: true,
          error,
          count: prevState.count + 1,
          res_modal_status: 500,
          res_modal_message: error
        }));
      }
    );
  };

  const onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    setCommunicationExpandPageState((prevState) => ({
      ...prevState,
      messagesLoaded: false
    }));
    deleteAMessageInCommunicationThread(student_id, message_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          const new_messages = [...communicationExpandPageState.thread];
          let idx = new_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          const new_upper_messages = [
            ...communicationExpandPageState.upperThread
          ];
          let idx2 = new_upper_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx2 !== -1) {
            new_upper_messages.splice(idx2, 1);
          }
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            success,
            messagesLoaded: true,
            count: prevState.count + 1,
            upperThread: new_upper_messages,
            thread: new_messages,
            buttonDisabled: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCommunicationExpandPageState((prevState) => ({
            ...prevState,
            messagesLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCommunicationExpandPageState((prevState) => ({
          ...prevState,
          messagesLoaded: true,
          count: prevState.count + 1,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleDrawerOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const DrawerChatMemo = () => {
    return (
      <MemoizedEmbeddedChatList count={communicationExpandPageState.count} />
    );
  };
  const {
    messagesLoaded,
    isLoaded,
    res_status,
    res_modal_status,
    res_modal_message
  } = communicationExpandPageState;

  if (!isLoaded && !communicationExpandPageState.thread) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const student_name = `${communicationExpandPageState.student.firstname} ${
    communicationExpandPageState.student.lastname
  } ${
    communicationExpandPageState.student.firstname_chinese
      ? communicationExpandPageState.student.firstname_chinese
      : ''
  } ${
    communicationExpandPageState.student.lastname_chinese
      ? communicationExpandPageState.student.lastname_chinese
      : ''
  }`;
  const student_name_english = `${communicationExpandPageState.student.firstname} ${communicationExpandPageState.student.lastname}`;
  // const template_input = JSON.parse(
  //   `{"time":1689452160435,"blocks":[{"id":"WHsFbpmWmH","type":"paragraph","data":{"text":"<b>我的問題：</b>"}},{"id":"F8K_f07R8l","type":"paragraph","data":{"text":"&lt;Example&gt; 我想選課，不知道下學期要選什麼"}},{"id":"yYUL0bYWSB","type":"paragraph","data":{"text":"<b>我想和顧問討論</b>："}},{"id":"wJu56jmAKC","type":"paragraph","data":{"text":"&lt;Example&gt; 課程符合度最佳化"}}],"version":"2.27.2"}`
  // );
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
    >
      <Grid container>
        <Grid
          item
          style={{ width: '300px', marginLeft: '-24px' }}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <div
              style={{
                height: window.innerHeight - 112,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  overflowY: 'auto' /* Enable vertical scrolling */,
                  maxHeight:
                    window.innerHeight -
                    112 /* Adjusted max height, considering header */
                }}
              >
                <MemoizedEmbeddedChatList
                  count={communicationExpandPageState.count}
                />
              </div>
            </div>
          </Box>
        </Grid>
        <Grid item xs md style={{ marginLeft: '8px' }}>
          <Box
            className="sticky-top"
            sx={{
              display: 'flex'
            }}
          >
            {ismobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={(e) => handleDrawerOpen(e)}
                edge="start"
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Avatar {...stringAvatar(student_name_english)}></Avatar>
            <Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ ml: 1, mt: 1 }}
              >
                {student_name_english}
              </Typography>
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
                  height: window.innerHeight - 112 - 40,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    overflowY: 'auto' /* Enable vertical scrolling */,
                    maxHeight:
                      window.innerHeight -
                      112 -
                      40 /* Adjusted max height, considering header */
                  }}
                  ref={scrollableRef}
                >
                  <Fragment>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={9}>
                        <Box variant="body1">
                          <List>
                            <ListItem>
                              <Typography fontWeight="bold">
                                <Link
                                  to={
                                    is_TaiGer_Student(user)
                                      ? `${DEMO.SURVEY_LINK}`
                                      : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                          communicationExpandPageState.student_id,
                                          DEMO.SURVEY_HASH
                                        )}`
                                  }
                                  component={LinkDom}
                                  target="_blank"
                                >
                                  {t('My Survey')}{' '}
                                  <FiExternalLink
                                    className="mx-0 mb-1"
                                    style={{ cursor: 'pointer' }}
                                  />
                                </Link>
                                <Link
                                  to={
                                    is_TaiGer_Student(user)
                                      ? `${DEMO.BASE_DOCUMENTS_LINK}`
                                      : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                          communicationExpandPageState.student_id,
                                          DEMO.PROFILE_HASH
                                        )}`
                                  }
                                  component={LinkDom}
                                  target="_blank"
                                >
                                  Base Document{' '}
                                  <FiExternalLink
                                    style={{ cursor: 'pointer' }}
                                  />
                                </Link>
                                <Link
                                  to={`${DEMO.COURSES_LINK}/${communicationExpandPageState.student_id}`}
                                  component={LinkDom}
                                  target="_blank"
                                >
                                  {t('My Courses')}{' '}
                                  <FiExternalLink
                                    className="mx-0 mb-1"
                                    style={{ cursor: 'pointer' }}
                                  />
                                </Link>
                              </Typography>
                            </ListItem>
                          </List>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography fontWeight="bold">
                          {t('Agents')}:
                        </Typography>
                        {communicationExpandPageState.student?.agents?.map(
                          (agent, i) => (
                            <Typography key={i}>
                              <Link
                                to={`${DEMO.TEAM_AGENT_PROFILE_LINK(
                                  agent._id.toString()
                                )}`}
                                component={LinkDom}
                              >{`${agent.firstname} ${agent.lastname}`}</Link>
                            </Typography>
                          )
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="outlined"
                          onClick={handleLoadMessages}
                          disabled={
                            communicationExpandPageState.loadButtonDisabled
                          }
                          sx={{ mb: 2 }}
                        >
                          {t('Load')}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        {communicationExpandPageState.upperThread.length >
                          0 && (
                          <MessageList
                            accordionKeys={
                              communicationExpandPageState.uppderaccordionKeys
                            }
                            student_id={communicationExpandPageState.student._id.toString()}
                            isUpperMessagList={true}
                            thread={communicationExpandPageState.upperThread}
                            isLoaded={communicationExpandPageState.isLoaded}
                            user={user}
                            onDeleteSingleMessage={onDeleteSingleMessage}
                            isTaiGerView={true}
                          />
                        )}
                        <MessageList
                          accordionKeys={
                            communicationExpandPageState.accordionKeys
                          }
                          student_id={communicationExpandPageState.student._id.toString()}
                          isUpperMessagList={false}
                          thread={communicationExpandPageState.thread}
                          isLoaded={communicationExpandPageState.isLoaded}
                          user={user}
                          onDeleteSingleMessage={onDeleteSingleMessage}
                          isTaiGerView={true}
                        />
                        {communicationExpandPageState.student.archiv !==
                        true ? (
                          <Card>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Card
                                  sx={{
                                    padding: 2,
                                    ...(!ismobile && {
                                      maxWidth: windowInnerWidth - 664
                                    }),
                                    pt: 2,
                                    '& .MuiAvatar-root': {
                                      width: 32,
                                      height: 32,
                                      ml: -0.5,
                                      mr: 1
                                    }
                                  }}
                                >
                                  <Avatar
                                    {...stringAvatar(
                                      `${user.firstname} ${user.lastname}`
                                    )}
                                  />
                                  <Box style={{ marginLeft: '10px', flex: 1 }}>
                                    <Typography>
                                      {user.firstname} {user.lastname}
                                    </Typography>
                                  </Box>

                                  <CommunicationThreadEditor
                                    thread={communicationExpandPageState.thread}
                                    buttonDisabled={
                                      communicationExpandPageState.buttonDisabled
                                    }
                                    editorState={
                                      communicationExpandPageState.editorState
                                    }
                                    handleClickSave={handleClickSave}
                                  />
                                </Card>
                              </Grid>
                            </Grid>
                          </Card>
                        ) : (
                          <Card>
                            {t(
                              'The service is finished. Therefore, it is readonly.'
                            )}
                          </Card>
                        )}
                        {res_modal_status >= 400 && (
                          <ModalMain
                            ConfirmError={ConfirmError}
                            res_modal_status={res_modal_status}
                            res_modal_message={res_modal_message}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Fragment>
                </div>
              </div>
            ) : (
              <CircularProgress />
            ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default CommunicationExpandPage;