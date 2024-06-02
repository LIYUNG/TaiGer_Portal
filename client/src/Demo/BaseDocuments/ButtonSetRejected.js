import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  CircularProgress,
  TableCell,
  TableRow,
  InputLabel,
  TextField,
  Typography
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LaunchIcon from '@mui/icons-material/Launch';

import FilePreview from '../../components/FilePreview/FilePreview';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import {
  ACCEPT_STYLE,
  FILE_NOT_OK_SYMBOL,
  convertDate
} from '../Utils/contants';
import { BASE_URL } from '../../api/request';

import { updateProfileDocumentStatus } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import { useTranslation } from 'react-i18next';

function ButtonSetRejected(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [buttonSetRejectedState, setButtonSetRejectedState] = useState({
    error: '',
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    docName: '',
    feedback: '',
    comments: props.message,
    file: '',
    isLoaded: props.isLoaded,
    deleteFileWarningModel: props.deleteFileWarningModel,
    CommentModel: false,
    showPreview: false,
    preview_path: '#',
    rejectProfileFileModel: props.rejectProfileFileModel,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false,
    acceptProfileFileModel: false,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString(),
      comments: props.message
    }));
  }, [props.student._id]);

  useEffect(() => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString(),
      comments: props.message
    }));
  }, [props.isLoaded]);

  const closeOffcanvasWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };
  const openOffcanvasWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeWarningWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false
    }));
  };

  const openCommentWindow = (student_id, category) => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      CommentModel: true,
      student_id,
      category
    }));
  };

  const closeCommentWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      CommentModel: false
    }));
  };

  const closePreviewWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const showPreview = (e, path) => {
    e.preventDefault();
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path
    }));
  };

  const onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      comments: rejectmessage
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setButtonSetRejectedState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setButtonSetRejectedState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

  const onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.onDeleteFilefromstudent(
      buttonSetRejectedState.category,
      buttonSetRejectedState.student_id
    );
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(buttonSetRejectedState.link, props.k);
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  const onUpdateRejectMessageStudent = (e) => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    e.preventDefault();
    updateProfileDocumentStatus(
      buttonSetRejectedState.category,
      buttonSetRejectedState.student_id,
      'rejected',
      buttonSetRejectedState.comments
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setButtonSetRejectedState((prevState) => ({
            ...prevState,
            student: data,
            success,
            CommentModel: false,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setButtonSetRejectedState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setButtonSetRejectedState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const closeAcceptWarningWindow = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      acceptProfileFileModel: false
    }));
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    props.onUpdateProfileFilefromstudent(
      buttonSetRejectedState.category,
      buttonSetRejectedState.student_id,
      buttonSetRejectedState.status,
      buttonSetRejectedState.feedback
    );
  };

  const ConfirmError = () => {
    setButtonSetRejectedState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_modal_status, res_modal_message } = buttonSetRejectedState;
  var ButttonRow_Rejected;
  ButttonRow_Rejected = (
    <TableRow>
      <TableCell>{FILE_NOT_OK_SYMBOL}</TableCell>
      <TableCell>
        {t(props.docName, { ns: 'common' })}
        <Link
          to={
            buttonSetRejectedState.link && buttonSetRejectedState.link != ''
              ? buttonSetRejectedState.link
              : '/'
          }
          component={LinkDom}
          target="_blank"
          sx={{ ml: 1 }}
        >
          <Button size="small" variant="outlined" endIcon={<LaunchIcon />}>
            {t('Read More')}
          </Button>
        </Link>
        {is_TaiGer_Admin(user) && (
          <a onClick={openOffcanvasWindow} style={{ cursor: 'pointer' }}>
            [Edit]
          </a>
        )}
      </TableCell>
      <TableCell>{convertDate(props.time)}</TableCell>
      <TableCell>
        <Button
          color="primary"
          variant="contained"
          size="small"
          title="Download"
          startIcon={<FileDownloadIcon />}
          onClick={(e) => showPreview(e, props.path)}
        >
          {t('Download', { ns: 'common' })}
        </Button>
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Button
          size="small"
          variant="outlined"
          disabled={!buttonSetRejectedState.isLoaded}
          title="Show Comments"
          onClick={() =>
            openCommentWindow(buttonSetRejectedState.student_id, props.k)
          }
          startIcon={<MessageIcon />}
        >
          {t('Message', { ns: 'common' })}
        </Button>
      </TableCell>
      <TableCell></TableCell>
      {is_TaiGer_AdminAgent(user) || is_TaiGer_Student(user) ? (
        <TableCell>
          <Button
            variant="contained"
            color="error"
            size="small"
            title="Delete"
            disabled={!buttonSetRejectedState.isLoaded}
            onClick={(e) =>
              onDeleteFileWarningPopUp(
                e,
                props.k,
                buttonSetRejectedState.student_id,
                props.docName
              )
            }
            startIcon={<DeleteIcon />}
          >
            {t('Delete', { ns: 'common' })}
          </Button>
        </TableCell>
      ) : (
        <TableCell></TableCell>
      )}
    </TableRow>
  );

  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      {ButttonRow_Rejected}
      <ModalNew
        open={buttonSetRejectedState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h5">{t('Warning', { ns: 'common' })}</Typography>
        <Typography sx={{ my: 2 }}>
          {t('Do you want to delete')} {props.docName}?
        </Typography>

        <Button
          variant="contained"
          disabled={!buttonSetRejectedState.isLoaded}
          onClick={(e) => onDeleteFilefromstudent(e)}
          sx={{ mr: 1 }}
        >
          {!buttonSetRejectedState.isLoaded ? (
            <CircularProgress />
          ) : (
            t('Yes', { ns: 'common' })
          )}
        </Button>
        <Button onClick={closeWarningWindow} variant="outlined">
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={buttonSetRejectedState.CommentModel}
        onClose={closeCommentWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h6">{t('Comments', { ns: 'common' })}</Typography>
        {is_TaiGer_Student(user) ? (
          <>
            <Typography>{buttonSetRejectedState.comments}</Typography>
            <Typography>
              Please delete the old file before upload the new file.
            </Typography>
            <Button onClick={closeCommentWindow}>{t('Ok')}</Button>
          </>
        ) : (
          <>
            <Typography>
              <InputLabel sx={{ my: 2 }}>
                Please give a reason why the uploaded{' '}
                {buttonSetRejectedState.category} is invalied?
              </InputLabel>
              <TextField
                type="text"
                placeholder="ex. Poor scanned quality."
                value={buttonSetRejectedState.comments || ''}
                onChange={(e) => handleRejectMessage(e, e.target.value)}
              />
            </Typography>
            <Box>
              <Button
                disabled={buttonSetRejectedState.comments === ''}
                onClick={(e) => onUpdateRejectMessageStudent(e)}
              >
                {!buttonSetRejectedState.isLoaded ? (
                  <CircularProgress size={24} />
                ) : (
                  t('Update', { ns: 'common' })
                )}
              </Button>
              <Button onClick={closeCommentWindow} variant="light">
                {t('Close', { ns: 'common' })}
              </Button>
            </Box>
          </>
        )}
      </ModalNew>
      <ModalNew
        open={buttonSetRejectedState.showPreview}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
        size="xl"
      >
        <Typography id="contained-d-title-vcenter">{props.path}</Typography>
        <Typography>
          <FilePreview
            path={buttonSetRejectedState.preview_path}
            student_id={buttonSetRejectedState.student_id.toString()}
          />
        </Typography>
        {props.path.split('.')[1] !== 'pdf' && (
          <a
            href={`${BASE_URL}/api/students/${buttonSetRejectedState.student_id.toString()}/files/${
              props.path
            }`}
            download
            target="_blank"
            rel="noreferrer"
          >
            <Button
              color="secondary"
              variant="contained"
              size="small"
              title="Download"
              startIcon={<FileDownloadIcon />}
            >
              {t('Download', { ns: 'common' })}
            </Button>
          </a>
        )}
        {!(is_TaiGer_Editor(user) || is_TaiGer_Student(user)) && (
          <Button
            color={ACCEPT_STYLE}
            variant="contained"
            size="small"
            title="Mark as accepted"
            disabled={!buttonSetRejectedState.isLoaded}
            onClick={(e) =>
              onUpdateProfileDocStatus(
                e,
                props.k,
                buttonSetRejectedState.student_id,
                'accepted'
              )
            }
          >
            {t('Accept', { ns: 'common' })}
          </Button>
        )}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={closePreviewWindow}
        >
          {!buttonSetRejectedState.isLoaded ? (
            <CircularProgress />
          ) : (
            t('Close', { ns: 'common' })
          )}
        </Button>
      </ModalNew>
      <ModalNew
        open={buttonSetRejectedState.acceptProfileFileModel}
        onClose={closeAcceptWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h5">Warning</Typography>

        <Typography sx={{ my: 2 }}>
          {buttonSetRejectedState.category} is a valid and can be used for the
          application?
        </Typography>

        <Button
          color="primary"
          variant="contained"
          disabled={!buttonSetRejectedState.isLoaded}
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {!buttonSetRejectedState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Yes', { ns: 'common' })
          )}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={closeAcceptWarningWindow}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <OffcanvasBaseDocument
        open={buttonSetRejectedState.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={buttonSetRejectedState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          buttonSetRejectedState.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default ButtonSetRejected;
