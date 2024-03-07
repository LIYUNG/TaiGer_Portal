import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
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
  Breadcrumbs
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { stringAvatar } from '../Utils/contants';
import { TopBar } from '../../components/TopBar/TopBar';

function CommunicationSinglePage() {
  const { student_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [communicationSinglePageState, setCommunicationSinglePageState] =
    useState({
      error: '',
      isLoaded: false,
      thread: null,
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
    setCommunicationSinglePageState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    getCommunicationThread(student_id).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            success,
            thread: data.reverse(),
            upperThread: [],
            isLoaded: true,
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
        } else {
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setCommunicationSinglePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [student_id]);

  const ConfirmError = () => {
    setCommunicationSinglePageState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const handleLoadMessages = () => {
    setCommunicationSinglePageState((prevState) => ({
      ...prevState,
      loadButtonDisabled: true
    }));
    loadCommunicationThread(
      student_id,
      communicationSinglePageState.pageNumber + 1
    ).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            success,
            upperThread: [
              ...data.reverse(),
              ...communicationSinglePageState.upperThread
            ],
            isLoaded: true,
            student,
            pageNumber: communicationSinglePageState.pageNumber + 1,
            uppderaccordionKeys: [
              ...new Array(
                communicationSinglePageState.uppderaccordionKeys.length
              )
                .fill()
                .map((x, i) => i),
              ...new Array(data.length)
                .fill()
                .map((x, i) =>
                  communicationSinglePageState.uppderaccordionKeys !== -1
                    ? i +
                      communicationSinglePageState.uppderaccordionKeys.length
                    : -1
                )
            ],
            loadButtonDisabled: data.length === 0 ? true : false,
            res_status: status
          }));
        } else {
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setCommunicationSinglePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    setCommunicationSinglePageState((prevState) => ({
      ...prevState,
      buttonDisabled: true
    }));
    var message = JSON.stringify(editorState);

    postCommunicationThread(
      communicationSinglePageState.student._id.toString(),
      message
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            success,
            editorState: {},
            thread: [...communicationSinglePageState.thread, ...data],
            isLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...communicationSinglePageState.accordionKeys,
              communicationSinglePageState.accordionKeys.length
            ],
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCommunicationSinglePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: error
        }));
      }
    );
  };

  const onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    setCommunicationSinglePageState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    deleteAMessageInCommunicationThread(student_id, message_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          const new_messages = [...communicationSinglePageState.thread];
          let idx = new_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          const new_upper_messages = [
            ...communicationSinglePageState.upperThread
          ];
          let idx2 = new_upper_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx2 !== -1) {
            new_upper_messages.splice(idx2, 1);
          }
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            upperThread: new_upper_messages,
            thread: new_messages,
            buttonDisabled: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCommunicationSinglePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCommunicationSinglePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const { isLoaded, res_status, res_modal_status, res_modal_message } =
    communicationSinglePageState;

  if (!isLoaded && !communicationSinglePageState.thread) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const student_name = `${communicationSinglePageState.student.firstname} ${
    communicationSinglePageState.student.lastname
  } ${
    communicationSinglePageState.student.firstname_chinese
      ? communicationSinglePageState.student.firstname_chinese
      : ''
  } ${
    communicationSinglePageState.student.lastname_chinese
      ? communicationSinglePageState.student.lastname_chinese
      : ''
  }`;
  // const template_input = JSON.parse(
  //   `{"time":1689452160435,"blocks":[{"id":"WHsFbpmWmH","type":"paragraph","data":{"text":"<b>我的問題：</b>"}},{"id":"F8K_f07R8l","type":"paragraph","data":{"text":"&lt;Example&gt; 我想選課，不知道下學期要選什麼"}},{"id":"yYUL0bYWSB","type":"paragraph","data":{"text":"<b>我想和顧問討論</b>："}},{"id":"wJu56jmAKC","type":"paragraph","data":{"text":"&lt;Example&gt; 課程符合度最佳化"}}],"version":"2.27.2"}`
  // );
  TabTitle(`${student_name}`);
  if (!isLoaded) {
    return <Loading />;
  }
  return (
    <>
      {communicationSinglePageState.student?.archiv && (
        <TopBar>
          Status: <b>Close</b>
        </TopBar>
      )}
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.DASHBOARD_LINK}`}
              >
                {appConfig.companyName}
              </Link>
              {is_TaiGer_role(user) && (
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    communicationSinglePageState.student_id,
                    DEMO.PROFILE_HASH
                  )}`}
                >
                  {student_name}
                </Link>
              )}
              <Typography color="text.primary">Messege</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6">Instructions:</Typography>
            <Box variant="body1">
              {appConfig.companyName}
              顧問皆位於中歐時區，無法及時回復，為確保有
              <b>效率溝通</b>，留言時請注意以下幾點：
              <List>
                <ListItem>
                  <Typography fontWeight="bold">
                    1. 請把{' '}
                    <Link
                      to={
                        is_TaiGer_Student(user)
                          ? `${DEMO.SURVEY_LINK}`
                          : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                              communicationSinglePageState.student_id,
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
                    填好,{' '}
                    <Link
                      to={
                        is_TaiGer_Student(user)
                          ? `${DEMO.BASE_DOCUMENTS_LINK}`
                          : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                              communicationSinglePageState.student_id,
                              DEMO.PROFILE_HASH
                            )}`
                      }
                      component={LinkDom}
                      target="_blank"
                    >
                      Base Document{' '}
                      <FiExternalLink style={{ cursor: 'pointer' }} />
                    </Link>
                    , 文件有的都盡量先掃描上傳,{' '}
                    <Link
                      to={`${DEMO.COURSES_LINK}/${communicationSinglePageState.student_id}`}
                      component={LinkDom}
                      target="_blank"
                    >
                      {t('My Courses')}{' '}
                      <FiExternalLink
                        className="mx-0 mb-1"
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                    課程填好，之後 Agent 在回答問題時比較能掌握狀況。
                  </Typography>
                </ListItem>
                <ListItem>
                  2. 描述你的問題，請盡量一次列出所有問題，顧問可以一次回答。
                </ListItem>
                <ListItem>3. 你想要完成事項。</ListItem>
                <ListItem>
                  註：或想一次處理，請準備好所有問題，並和顧問約時間通話。
                </ListItem>
                <ListItem>
                  {appConfig.companyName}{' '}
                  顧問平時的工作時段位於美國或歐洲時區，因此可能無法立即回覆您的訊息，敬請諒解。依據您的問題複雜度，顧問將會在一至五個工作日內回覆您。因此，請在訊息來往時保持有效率的溝通，以確保迅速解決問題。
                  顧問隨時需要了解您的進展情況，為了避免不必要的來回詢問學生資料進度，為此，請務必將您在TaiGer
                  Portal平台上的個人資訊保持最新，以確保訊息的準確性。
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography fontWeight="bold">{t('Agents')}:</Typography>
            {communicationSinglePageState.student?.agents?.map((agent, i) => (
              <Typography key={i}>
                <Link
                  to={`${DEMO.TEAM_AGENT_PROFILE_LINK(agent._id.toString())}`}
                  component={LinkDom}
                >{`${agent.firstname} ${agent.lastname}`}</Link>
              </Typography>
            ))}
          </Grid>
        </Grid>
      </>
      <Button
        fullWidth
        color="secondary"
        variant="outlined"
        onClick={handleLoadMessages}
        disabled={communicationSinglePageState.loadButtonDisabled}
        sx={{ mb: 2 }}
      >
        {t('Load')}
      </Button>
      <Box>
        {communicationSinglePageState.upperThread.length > 0 && (
          <MessageList
            accordionKeys={communicationSinglePageState.uppderaccordionKeys}
            student_id={communicationSinglePageState.student._id.toString()}
            isUpperMessagList={true}
            thread={communicationSinglePageState.upperThread}
            isLoaded={communicationSinglePageState.isLoaded}
            user={user}
            onDeleteSingleMessage={onDeleteSingleMessage}
          />
        )}
        <MessageList
          accordionKeys={communicationSinglePageState.accordionKeys}
          student_id={communicationSinglePageState.student._id.toString()}
          isUpperMessagList={false}
          thread={communicationSinglePageState.thread}
          isLoaded={communicationSinglePageState.isLoaded}
          user={user}
          onDeleteSingleMessage={onDeleteSingleMessage}
        />
      </Box>
      {communicationSinglePageState.student.archiv !== true ? (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card
                sx={{
                  padding: 2,
                  maxWidth: window.innerWidth - 64,
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
                  {...stringAvatar(`${user.firstname} ${user.lastname}`)}
                />
                <Typography style={{ marginLeft: '10px', flex: 1 }}>
                  {user.firstname} {user.lastname}
                </Typography>

                <CommunicationThreadEditor
                  thread={communicationSinglePageState.thread}
                  buttonDisabled={communicationSinglePageState.buttonDisabled}
                  editorState={communicationSinglePageState.editorState}
                  handleClickSave={handleClickSave}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Card>{t('The service is finished. Therefore, it is readonly.')}</Card>
      )}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
    </>
  );
}

export default CommunicationSinglePage;
