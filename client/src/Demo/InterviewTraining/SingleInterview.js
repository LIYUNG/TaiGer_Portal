import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Card, Button, Typography, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { deleteInterview, getInterview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { stringAvatar } from '../Utils/contants';
import MessageList from '../CVMLRLCenter/DocModificationThreadPage/MessageList';
import { useAuth } from '../../components/AuthProvider';
import DocThreadEditor from '../CVMLRLCenter/DocModificationThreadPage/DocThreadEditor';

function SingleInterview() {
  const { interview_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [singleInterviewState, setSingleInterviewState] = useState({
    error: '',
    author: '',
    isLoaded: false,
    success: false,
    isDeleteSuccessful: false,
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

  const singleExpandtHandler = () => {};

  const onDeleteSingleMessage = () => {
    // e.preventDefault();
    // setDocModificationThreadPageState((prevState) => ({
    //   ...prevState,
    //   isLoaded: false
    // }));
    // deleteAMessageInThread(
    //   docModificationThreadPageState.documentsthreadId,
    //   message_id
    // ).then(
    //   (resp) => {
    //     const { success } = resp.data;
    //     const { status } = resp;
    //     if (success) {
    //       // TODO: remove that message
    //       var new_messages = [
    //         ...docModificationThreadPageState.thread.messages
    //       ];
    //       let idx = docModificationThreadPageState.thread.messages.findIndex(
    //         (message) => message._id.toString() === message_id
    //       );
    //       if (idx !== -1) {
    //         new_messages.splice(idx, 1);
    //       }
    //       setDocModificationThreadPageState((prevState) => ({
    //         ...prevState,
    //         success,
    //         isLoaded: true,
    //         thread: {
    //           ...docModificationThreadPageState.thread,
    //           messages: new_messages
    //         },
    //         buttonDisabled: false,
    //         res_modal_status: status
    //       }));
    //     } else {
    //       // TODO: what if data is oversize? data type not match?
    //       const { message } = resp.data;
    //       setDocModificationThreadPageState((prevState) => ({
    //         ...prevState,
    //         isLoaded: true,
    //         buttonDisabled: false,
    //         res_modal_message: message,
    //         res_modal_status: status
    //       }));
    //     }
    //   },
    //   (error) => {
    //     setDocModificationThreadPageState((prevState) => ({
    //       ...prevState,
    //       isLoaded: true,
    //       error,
    //       res_modal_status: 500,
    //       res_modal_message: ''
    //     }));
    //   }
    // );
    // setDocModificationThreadPageState((prevState) => ({
    //   ...prevState,
    //   in_edit_mode: false
    // }));
  };

  // const handleClickSave = (e, interview, editorState) => {
  //   e.preventDefault();
  //   const message = JSON.stringify(editorState);
  //   const interviewData_temp = interview;
  //   interviewData_temp.interview_description = message;
  //   updateInterview(interview_id, interviewData_temp).then(
  //     (resp) => {
  //       const { success, data } = resp.data;
  //       const { status } = resp;
  //       if (success) {
  //         setSingleInterviewState((prevState) => ({
  //           ...prevState,
  //           success,
  //           interview: data,
  //           editorState,
  //           isEdit: !singleInterviewState.isEdit,
  //           author: data.author,
  //           isLoaded: true,
  //           res_modal_status: status
  //         }));
  //       } else {
  //         const { message } = resp.data;
  //         setSingleInterviewState((prevState) => ({
  //           ...prevState,
  //           isLoaded: true,
  //           res_modal_message: message,
  //           res_modal_status: status
  //         }));
  //       }
  //     },
  //     (error) => {
  //       setSingleInterviewState((prevState) => ({
  //         ...prevState,
  //         error
  //       }));
  //     }
  //   );
  //   setSingleInterviewState((state) => ({ ...state, in_edit_mode: false }));
  // };

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

  const handleDeleteInterview = () => {
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
    isDeleteSuccessful,
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
          <InterviewItems
            expanded={true}
            readOnly={false}
            interview={interview}
            openDeleteDocModalWindow={openDeleteDocModalWindow}
          />
          <MessageList
            documentsthreadId={interview.thread_id?._id?.toString()}
            accordionKeys={[]}
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
              {interview.thread_id.isFinalVersion ? (
                <Typography>This discussion thread is close.</Typography>
              ) : (
                <DocThreadEditor
                  thread={interview.thread_id}
                  buttonDisabled={false}
                  editorState={{}}
                  handleClickSave={() => {}}
                  file={[]}
                  onFileChange={() => {}}
                  checkResult={() => {}}
                />
              )}
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
        <Card>
          <AiFillCheckCircle color="limegreen" size={24} title="Confirmed" />{' '}
          &nbsp; Interview request deleted successfully!
        </Card>
      ) : (
        <Card>Status 404: Error! Interview not found.</Card>
      )}

      <ModalNew
        show={singleInterviewState.SetDeleteDocModel}
        onHide={closeDeleteDocModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Warning', { ns: 'common' })}</Typography>
        Do you want to delete the interview request of{' '}
        <b>{singleInterviewState.interview_name_toBeDelete}</b>?
        <Button disabled={!isLoaded} onClick={handleDeleteInterview}>
          Yes
        </Button>
        <Button onClick={closeDeleteDocModalWindow}>No</Button>
      </ModalNew>
    </>
  );
}
export default SingleInterview;
