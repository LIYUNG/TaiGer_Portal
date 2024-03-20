import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';

import { BASE_URL } from '../../api/request';
import FilePreview from '../../components/FilePreview/FilePreview';
import { convertDate } from '../Utils/contants';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';

function ButtonSetAccepted(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [buttonSetAcceptedState, setButtonSetAcceptedState] = useState({
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    docName: '',
    comments: '',
    feedback: '',
    file: '',
    isLoaded: props.isLoaded,
    deleteFileWarningModel: false,
    showPreview: false,
    preview_path: '#',
    rejectProfileFileModel: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  });

  useEffect(() => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.isLoaded]);

  useEffect(() => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.student._id]);

  const closeOffcanvasWindow = () => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };

  const openOffcanvasWindow = () => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeWarningWindow = () => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
  };

  const closePreviewWindow = () => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const showPreview = (e, path) => {
    e.preventDefault();
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path
    }));
  };

  const closeRejectWarningWindow = () => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const onChangeDeleteField = (e) => {
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      delete_field: e.target.value
    }));
  };

  const onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setButtonSetAcceptedState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setButtonSetAcceptedState((prevState) => ({
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
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.onDeleteFilefromstudent(
      buttonSetAcceptedState.category,
      buttonSetAcceptedState.student_id
    );
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.onUpdateProfileFilefromstudent(
      buttonSetAcceptedState.category,
      buttonSetAcceptedState.student_id,
      buttonSetAcceptedState.status,
      buttonSetAcceptedState.feedback
    );
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(buttonSetAcceptedState.link, props.k);
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setButtonSetAcceptedState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  var ButttonRow_Accepted;
  ButttonRow_Accepted = (
    <TableRow>
      <TableCell>
        <IoCheckmarkCircle size={24} color="limegreen" title="Valid Document" />
      </TableCell>
      <TableCell>
        {props.docName}
        <Link
          to={
            buttonSetAcceptedState.link && buttonSetAcceptedState.link != ''
              ? buttonSetAcceptedState.link
              : '/'
          }
          component={LinkDom}
          target="_blank"
          sx={{ ml: 1 }}
        >
          <Button size="small" variant="outlined" startIcon={<LinkIcon />}>
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
          size="small"
          title="Download"
          variant="contained"
          onClick={(e) => showPreview(e, props.path)}
          startIcon={<FileDownloadIcon />}
        >
          {t('Download')}
        </Button>
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        {is_TaiGer_AdminAgent(user) && (
          <Button
            color="error"
            variant="contained"
            size="small"
            type="submit"
            title="Delete"
            disabled={!buttonSetAcceptedState.isLoaded}
            onClick={(e) =>
              onDeleteFileWarningPopUp(
                e,
                props.k,
                buttonSetAcceptedState.student_id,
                props.docName
              )
            }
            startIcon={<DeleteIcon />}
          >
            {t('Delete', { ns: 'common' })}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {ButttonRow_Accepted}
      <ModalNew
        open={buttonSetAcceptedState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">Warning</Typography>
        <Typography variant="h5">
          Do you want to delete {props.docName}?
        </Typography>
        <Typography>
          Please enter{' '}
          <i>
            <b>delete</b>
          </i>{' '}
          in order to delete the base document.
        </Typography>
        <TextField
          type="text"
          placeholder="delete"
          onChange={(e) => onChangeDeleteField(e)}
        />
        <Button
          disabled={
            !buttonSetAcceptedState.isLoaded ||
            buttonSetAcceptedState.delete_field !== 'delete'
          }
          onClick={(e) => onDeleteFilefromstudent(e)}
        >
          {!buttonSetAcceptedState.isLoaded ? <CircularProgress /> : t('Yes')}
        </Button>
        <Button onClick={closeWarningWindow} variant="light">
          No
        </Button>
      </ModalNew>
      <ModalNew
        open={buttonSetAcceptedState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Warning</Typography>
        <Typography variant="body1">
          Please give a reason why the uploaded{' '}
          {buttonSetAcceptedState.category} is invalied?
        </Typography>
        <TextField
          type="text"
          placeholder="ex. Poor scanned quality."
          onChange={(e) => handleRejectMessage(e, e.target.value)}
        />
        <Box>
          <Button
            disabled={buttonSetAcceptedState.feedback === ''}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!buttonSetAcceptedState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes')
            )}
          </Button>
          <Button onClick={closeRejectWarningWindow}>{t('No', { ns: 'common' })}</Button>
        </Box>
      </ModalNew>
      <AcceptProfileFileModel
        showPreview={buttonSetAcceptedState.showPreview}
        closePreviewWindow={closePreviewWindow}
        path={props.path}
        preview_path={buttonSetAcceptedState.preview_path}
        student_id={buttonSetAcceptedState.student_id}
        isLoaded={buttonSetAcceptedState.isLoaded}
        k={props.k}
        onUpdateProfileDocStatus={onUpdateProfileDocStatus}
      />
      {false && (
        <ModalNew
          open={buttonSetAcceptedState.showPreview}
          onClose={closePreviewWindow}
          aria-labelledby="contained-modal-title-vcenter2"
        >
          <Typography id="contained-d-title-vcenter">{props.path}</Typography>
          <FilePreview
            path={buttonSetAcceptedState.preview_path}
            student_id={buttonSetAcceptedState.student_id.toString()}
          />
          {props.path.split('.')[1] !== 'pdf' && (
            <a
              href={`${BASE_URL}/api/students/${buttonSetAcceptedState.student_id.toString()}/files/${
                props.path
              }`}
              download
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="small"
                color="primary"
                variant="contained"
                title="Download"
                startIcon={<FileDownloadIcon />}
              >
                {t('Download')}
              </Button>
            </a>
          )}
          {!(is_TaiGer_Editor(user) || is_TaiGer_Student(user)) && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={!buttonSetAcceptedState.isLoaded}
              onClick={(e) =>
                onUpdateProfileDocStatus(
                  e,
                  props.k,
                  buttonSetAcceptedState.student_id,
                  'rejected'
                )
              }
              startIcon={<CloseIcon />}
              sx={{ mr: 2 }}
            >
              {t('Reject')}
            </Button>
          )}
          <Button size="small" variant="outlined" onClick={closePreviewWindow}>
            {!buttonSetAcceptedState.isLoaded ? (
              <CircularProgress />
            ) : (
              t('Close', { ns: 'common' })
            )}
          </Button>
        </ModalNew>
      )}
      <OffcanvasBaseDocument
        open={buttonSetAcceptedState.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={buttonSetAcceptedState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          buttonSetAcceptedState.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default ButtonSetAccepted;
