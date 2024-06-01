import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Button,
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  SubmitMessageWithAttachment,
  deleteAMessageInThread,
  deleteInterview,
  getInterview,
  updateInterview
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { INTERVIEW_STATUS_E, stringAvatar } from '../Utils/contants';
import MessageList from '../CVMLRLCenter/DocModificationThreadPage/MessageList';
import { useAuth } from '../../components/AuthProvider';
import DocThreadEditor from '../CVMLRLCenter/DocModificationThreadPage/DocThreadEditor';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { TopBar } from '../../components/TopBar/TopBar';

function SingleInterview() {
  const { interview_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [singleInterviewState, setSingleInterviewState] = useState({
    error: '',
    file: null,
    author: '',
    isLoaded: false,
    success: false,
    isSubmissionLoaded: true,
    SetDeleteDocModel: false,
    SetAsFinalFileModel: false,
    isDeleteSuccessful: false,
    isDeleting: false,
    interview: {},
    editorState: null,
    isEdit: true,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getInterview(interview_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (!data) {
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
        if (success) {
          var initialEditorState = null;
          const author = data.author;
          if (data.interview_description) {
            initialEditorState = JSON.parse(data.interview_description);
          } else {
            initialEditorState = { time: new Date(), blocks: [] };
          }
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            interview: data,
            editorState: initialEditorState,
            accordionKeys:
              new Array(data.thread_id?.messages?.length)
                .fill()
                .map((x, i) =>
                  i === data.thread_id?.messages.length - 1 ? i : -1
                ) || [], // to collapse all
            author,
            success: success,
            res_status: status
          }));
        } else {
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setSingleInterviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [interview_id]);

  const closeSetAsFinalFileModelWindow = () => {
    setSingleInterviewState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };

  const singleExpandtHandler = (idx) => {
    let accordionKeys = [...singleInterviewState.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    setSingleInterviewState((prevState) => ({
      ...prevState,
      accordionKeys: accordionKeys
    }));
  };

  const onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    setSingleInterviewState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    deleteAMessageInThread(
      singleInterviewState.interview.thread_id?._id.toString(),
      message_id
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          var new_messages = [
            ...singleInterviewState.interview.thread_id.messages
          ];
          let idx = singleInterviewState.interview.thread_id.messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          setSingleInterviewState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            interview: {
              ...singleInterviewState.interview,
              thread_id: {
                ...singleInterviewState.interview.thread_id,
                messages: new_messages
              }
            },
            buttonDisabled: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleInterviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    var message = JSON.stringify(editorState);
    const formData = new FormData();

    if (singleInterviewState.file) {
      singleInterviewState.file.forEach((file) => {
        formData.append('files', file);
      });
    }

    // formData.append('files', singleInterviewState.file);
    formData.append('message', message);

    SubmitMessageWithAttachment(
      singleInterviewState.interview?.thread_id?._id.toString(),
      singleInterviewState.interview?.student_id?._id.toString(),
      formData
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleInterviewState((prevState) => ({
            ...prevState,
            success,
            interview: {
              ...singleInterviewState.interview,
              thread_id: {
                ...singleInterviewState.interview.thread_id,
                messages: data?.messages
              }
            },
            isLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...singleInterviewState.accordionKeys,
              data.messages.length - 1
            ],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleInterviewState((prevState) => ({
          ...prevState,
          error
        }));
      }
    );
  };

  const onFileChange = (e) => {
    e.preventDefault();
    const file_num = e.target.files.length;
    if (file_num <= 3) {
      if (!e.target.files) {
        return;
      }
      setSingleInterviewState((prevState) => ({
        ...prevState,
        file: Array.from(e.target.files)
      }));
    } else {
      setSingleInterviewState((prevState) => ({
        ...prevState,
        res_modal_message: 'You can only select up to 3 files.',
        res_modal_status: 423
      }));
    }
  };

  const openDeleteDocModalWindow = (e, interview) => {
    e.stopPropagation();
    setSingleInterviewState((prevState) => ({
      ...prevState,
      interview_id_toBeDelete: interview._id,
      interview_name_toBeDelete: `${interview.program_id.school} ${interview.program_id.program_name}`,
      SetDeleteDocModel: true
    }));
  };

  const closeDeleteDocModalWindow = () => {
    setSingleInterviewState((prevState) => ({
      ...prevState,
      SetDeleteDocModel: false
    }));
  };

  const handleAsFinalFile = (interview_id) => {
    console.log(interview_id);
    setSingleInterviewState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: true
    }));
  };

  const handleDeleteInterview = () => {
    setSingleInterviewState((prevState) => ({
      ...prevState,
      isDeleting: true
    }));
    deleteInterview(singleInterviewState.interview._id.toString()).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleInterviewState((prevState) => ({
            ...prevState,
            success,
            SetDeleteDocModel: false,
            isEdit: false,
            isDeleteSuccessful: true,
            isDeleting: false,
            interview: null,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleInterviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmSetAsFinalFileHandler = async (e) => {
    e.preventDefault();
    setSingleInterviewState((prevState) => ({
      ...prevState,
      isSubmissionLoaded: false // false to reload everything
    }));

    const resp = await updateInterview(interview._id.toString(), {
      isClosed: !interview.isClosed
    });
    const { data: interview_updated, success } = resp.data;
    if (success) {
      setSingleInterviewState((prevState) => ({
        ...prevState,
        isLoaded: true,
        interview: {
          ...singleInterviewState.interview,
          isClosed: interview_updated.isClosed
        },
        SetAsFinalFileModel: false,
        isSubmissionLoaded: true
      }));
    } else {
      const { message } = resp.data;
      setSingleInterviewState((prevState) => ({
        ...prevState,
        isLoaded: true,
        isSubmissionLoaded: true,
        res_modal_message: message,
        res_modal_status: resp.status
      }));
    }
  };

  const ConfirmError = () => {
    setSingleInterviewState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const {
    res_status,
    editorState,
    interview,
    accordionKeys,
    isDeleteSuccessful,
    isSubmissionLoaded,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = singleInterviewState;

  if (!isLoaded && !editorState) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  TabTitle(`Interview: ${singleInterviewState.document_title}`);
  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Link to={DEMO.INTERVIEW_LINK}>
        <Button variant="outlined" color="secondary">
          {t('Back')}
        </Button>
      </Link>
      {interview ? (
        <>
          {interview.isClosed && <TopBar />}
          <InterviewItems
            expanded={true}
            interview={interview}
            openDeleteDocModalWindow={openDeleteDocModalWindow}
          />
          <MessageList
            documentsthreadId={interview.thread_id?._id?.toString()}
            accordionKeys={accordionKeys}
            singleExpandtHandler={singleExpandtHandler}
            thread={interview.thread_id}
            isLoaded={true}
            user={user}
            onDeleteSingleMessage={onDeleteSingleMessage}
          />
          {user.archiv !== true ? (
            <Card
              sx={{
                p: 2,
                overflowWrap: 'break-word', // Add this line
                maxWidth: window.innerWidth - 64,
                marginTop: '1px',
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                }
              }}
            >
              <Avatar {...stringAvatar(`${user.firstname} ${user.lastname}`)} />
              <Typography
                variant="body1"
                sx={{ mt: 1 }}
                style={{ marginLeft: '10px', flex: 1 }}
              >
                <b>
                  {user.firstname} {user.lastname}
                </b>
              </Typography>
              {interview.isClosed ? (
                <Typography>This interview is closed.</Typography>
              ) : (
                <DocThreadEditor
                  thread={interview.thread_id}
                  buttonDisabled={false}
                  editorState={{}}
                  handleClickSave={handleClickSave}
                  file={singleInterviewState.file}
                  onFileChange={onFileChange}
                  checkResult={[]}
                />
              )}
              {is_TaiGer_role(user) &&
                (!singleInterviewState.interview.isClosed ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleAsFinalFile(interview?._id?.toString())
                    }
                    sx={{ mt: 2 }}
                  >
                    {isSubmissionLoaded ? (
                      t('Mark as finished')
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleAsFinalFile(interview?._id?.toString())
                    }
                    sx={{ mt: 2 }}
                  >
                    {isSubmissionLoaded ? (
                      t('Mark as open')
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </Button>
                ))}
            </Card>
          ) : (
            <Card>
              <Typography>
                Your service is finished. Therefore, you are in read only mode.
              </Typography>
            </Card>
          )}
        </>
      ) : isDeleteSuccessful ? (
        <Card sx={{ p: 1 }}>
          <Typography variant="body2">
            {INTERVIEW_STATUS_E.DELETED_SUCCESS_SYMBOL} &nbsp; Interview request
            deleted successfully!
          </Typography>
        </Card>
      ) : (
        <Card>
          <Typography variant="body2">
            Status 404: Error! Interview not found.
          </Typography>
        </Card>
      )}
      <ModalNew
        open={singleInterviewState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography variant="h6">{t('Warning', { ns: 'common' })}</Typography>
          Do you want to set{' '}
          <b>
            Interview for {interview?.student_id.firstname}{' '}
            {interview?.student_id.lastname} {interview?.program_id.school}{' '}
            {interview?.program_id.program_name} {interview?.program_id.degree}{' '}
            {interview?.program_id.semester}
          </b>{' '}
          as <b>{interview?.isClosed ? 'open' : 'closed'}</b>
          ?
          <br />
          <br />
          <Button
            color="primary"
            variant="contained"
            disabled={!isLoaded || !isSubmissionLoaded}
            onClick={(e) => ConfirmSetAsFinalFileHandler(e)}
            sx={{ mr: 2 }}
          >
            {isSubmissionLoaded ? (
              t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress size={24} />
            )}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={closeSetAsFinalFileModelWindow}
          >
            {t('No', { ns: 'common' })}
          </Button>
        </Box>
      </ModalNew>
      <ModalNew
        open={singleInterviewState.SetDeleteDocModel}
        onClose={closeDeleteDocModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Warning', { ns: 'common' })}</Typography>
        Do you want to delete the interview request of{' '}
        <b>{singleInterviewState.interview_name_toBeDelete}</b>?
        <br />
        <Button
          disabled={!isLoaded || singleInterviewState.isDeleting}
          variant="contained"
          color="primary"
          onClick={handleDeleteInterview}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={closeDeleteDocModalWindow}
        >
          No
        </Button>
      </ModalNew>
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
export default SingleInterview;
