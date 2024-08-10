import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';

import { BASE_URL } from '../../api/request';
import FilePreview from '../../components/FilePreview/FilePreview';
import { FILE_OK_SYMBOL, convertDate } from '../Utils/contants';
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
import {
  DownloadIconButton,
  DeleteIconButton
} from '../../components/Buttons/Button';

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
    <Box
      sx={{
        mb: 1,
        p: 2,
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={8} sm={8}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {FILE_OK_SYMBOL}
            <Typography variant="body1">
              {t(props.docName, { ns: 'common' })}
            </Typography>
            <Tooltip title={t('Read More')}>
              <IconButton
                component={LinkDom}
                to={
                  buttonSetAcceptedState.link &&
                  buttonSetAcceptedState.link !== ''
                    ? buttonSetAcceptedState.link
                    : '/'
                }
                target="_blank"
                size="small"
                color="primary"
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {is_TaiGer_Admin(user) && (
              <Typography
                component="a"
                onClick={openOffcanvasWindow}
                sx={{ cursor: 'pointer', ml: 1 }}
                color="primary"
              >
                [Edit]
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="textSecondary">
            {convertDate(props.time)}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <DownloadIconButton
              showPreview={showPreview}
              path={props.path}
              t={t}
            />
            {is_TaiGer_AdminAgent(user) && (
              <DeleteIconButton
                isLoaded={buttonSetAcceptedState.isLoaded}
                onDeleteFileWarningPopUp={onDeleteFileWarningPopUp}
                k={props.k}
                student_id={buttonSetAcceptedState.student_id}
                docName={props.docName}
                t={t}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      {ButttonRow_Accepted}
      <Dialog
        open={buttonSetAcceptedState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        size="small"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete {props.docName}?{' '}
          </DialogContentText>
          <TextField
            type="text"
            fullWidth
            required
            variant="standard"
            margin="dense"
            label={
              <>
                Please type <b>delete</b> to delete.
              </>
            }
            placeholder="delete"
            onChange={(e) => onChangeDeleteField(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            disabled={
              !buttonSetAcceptedState.isLoaded ||
              buttonSetAcceptedState.delete_field !== 'delete'
            }
            onClick={(e) => onDeleteFilefromstudent(e)}
          >
            {!buttonSetAcceptedState.isLoaded ? (
              <CircularProgress />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button onClick={closeWarningWindow} variant="outlined">
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={buttonSetAcceptedState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please give a reason why the uploaded{' '}
            {buttonSetAcceptedState.category} is invalied?
          </DialogContentText>
          <TextField
            type="text"
            fullWidth
            required
            placeholder="ex. Poor scanned quality."
            onChange={(e) => handleRejectMessage(e, e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={buttonSetAcceptedState.feedback === ''}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!buttonSetAcceptedState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button onClick={closeRejectWarningWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
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
                {t('Download', { ns: 'common' })}
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
              {t('Reject', { ns: 'documents' })}
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
