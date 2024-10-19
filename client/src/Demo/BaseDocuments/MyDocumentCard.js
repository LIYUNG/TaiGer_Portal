import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';

import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import {
  FILE_DONT_CARE_SYMBOL,
  FILE_MISSING_SYMBOL,
  FILE_NOT_OK_SYMBOL,
  FILE_OK_SYMBOL,
  FILE_UPLOADED_SYMBOL,
  base_documents_checklist,
  convertDate
} from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import FilePreview from '../../components/FilePreview/FilePreview';
import { BASE_URL } from '../../api/request';
import {
  CommentsIconButton,
  DeleteIconButton,
  DownloadIconButton,
  SetNeededIconButton,
  SetNotNeededIconButton,
  UploadIconButton
} from '../../components/Buttons/Button';
// import { updateProfileDocumentStatus } from '../../api';
import Loading from '../../components/Loading/Loading';

function MyDocumentCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [MyDocumentCardState, setMyDocumentCardState] = useState({
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    docName: '',
    comments: props.message,
    file: '',
    delete_field: '',
    isLoaded: props.isLoaded,
    feedback: '',
    deleteFileWarningModel: false,
    showPreview: false,
    preview_path: '#',
    num_points: base_documents_checklist[props.k]
      ? base_documents_checklist[props.k].length
      : 0,
    num_checked_points: 0,
    checkedBoxes: [],
    rejectProfileFileModel: false,
    acceptProfileFileModel: false,
    setMissingWindow: false,
    SetNeededWindow: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  });

  useEffect(() => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.isLoaded]);
  useEffect(() => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.student._id]);

  const closeOffcanvasWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };

  const openOffcanvasWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeWarningWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
  };

  const closePreviewWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const showPreview = (e, path) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path
    }));
  };

  const closeRejectWarningWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const closeAcceptWarningWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      acceptProfileFileModel: false
    }));
  };

  const onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      comments: rejectmessage
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else if (status === 'missing') {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        SetNeededWindow: true
      }));
    } else if (status === 'notneeded') {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        setMissingWindow: true
      }));
    } else {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(MyDocumentCardState.link, props.k);
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  const onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    props.onDeleteFilefromstudent(
      MyDocumentCardState.category,
      MyDocumentCardState.student_id
    );
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false
    }));
  };

  const openCommentWindow = (student_id, category) => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: true,
      status: 'rejected',
      student_id,
      category
    }));
  };

  const onChangeDeleteField = (e) => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      delete_field: e.target.value
    }));
  };

  const closeSetMissingWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      setMissingWindow: false
    }));
  };

  const closeSetNeededWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      SetNeededWindow: false
    }));
  };

  const handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.handleGeneralDocSubmit(e, k, student_id);
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    props.onUpdateProfileFilefromstudent(
      MyDocumentCardState.category,
      MyDocumentCardState.student_id,
      MyDocumentCardState.status,
      MyDocumentCardState.comments
    );
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      showPreview: false,
      SetNeededWindow: false,
      setMissingWindow: false,
      rejectProfileFileModel: false,
      acceptProfileFileModel: false
    }));
  };

  const onChecked = (e) => {
    const id = e.target.id;
    const isChecked = e.target.checked;
    const temp_checkedBoxes = [...MyDocumentCardState.checkedBoxes];
    if (isChecked) {
      // Add the ID to the list
      temp_checkedBoxes.push(id);
    } else {
      // Remove the ID from the list
      const index = temp_checkedBoxes.indexOf(id);
      if (index > -1) {
        temp_checkedBoxes.splice(index, 1);
      }
    }

    setMyDocumentCardState((prevState) => ({
      ...prevState,
      checkedBoxes: temp_checkedBoxes
    }));
  };

  const StatusIcon = () => {
    if (props.status === 'uploaded') {
      return FILE_UPLOADED_SYMBOL;
    } else if (props.status === 'accepted') {
      return FILE_OK_SYMBOL;
    } else if (props.status === 'rejected') {
      return FILE_NOT_OK_SYMBOL;
    } else if (props.status === 'notneeded') {
      return FILE_DONT_CARE_SYMBOL;
    } else {
      return FILE_MISSING_SYMBOL;
    }
  };

  const ButttonRow_Uploaded = ((props.status === 'notneeded' &&
    is_TaiGer_AdminAgent(user)) ||
    props.status === 'uploaded' ||
    props.status === 'rejected' ||
    props.status === 'missing' ||
    props.status === 'accepted') && (
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
            <StatusIcon />
            <Typography variant="body1">
              {t(props.docName, { ns: 'common' })}
            </Typography>
            <Tooltip title={t('Read More')}>
              <IconButton
                component={LinkDom}
                to={
                  MyDocumentCardState.link && MyDocumentCardState.link !== ''
                    ? MyDocumentCardState.link
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
          {props.status === 'rejected' && (
            <Typography variant="body2" fontWeight="bold">
              {t('Message', { ns: 'common' })}: {MyDocumentCardState.comments}
            </Typography>
          )}
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
            {(props.status === 'missing' || props.status === 'notneeded') &&
              (is_TaiGer_Student(user) || is_TaiGer_AdminAgent(user)) && (
                <UploadIconButton
                  user={user}
                  buttonState={MyDocumentCardState}
                  t={t}
                  handleGeneralDocSubmit={handleGeneralDocSubmit}
                  k={props.k}
                />
              )}
            {(props.status === 'rejected' ||
              props.status === 'uploaded' ||
              props.status === 'accepted') && (
              <DownloadIconButton
                showPreview={showPreview}
                path={props.path}
                t={t}
              />
            )}
            {props.status === 'rejected' && !is_TaiGer_Student(user) && (
              <CommentsIconButton
                buttonState={MyDocumentCardState}
                openCommentWindow={openCommentWindow}
                k={props.k}
                t={t}
              />
            )}
            {props.status === 'notneeded' && (
              <SetNeededIconButton
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                k={props.k}
                buttonState={MyDocumentCardState}
                t={t}
              />
            )}
            {(props.status === 'uploaded' ||
              props.status === 'rejected' ||
              (props.status === 'accepted' && is_TaiGer_AdminAgent(user))) &&
              !is_TaiGer_Editor(user) && (
                <DeleteIconButton
                  isLoaded={MyDocumentCardState.isLoaded}
                  onDeleteFileWarningPopUp={onDeleteFileWarningPopUp}
                  k={props.k}
                  student_id={MyDocumentCardState.student_id}
                  docName={props.docName}
                  t={t}
                />
              )}
            {props.status === 'missing' && is_TaiGer_AdminAgent(user) && (
              <SetNotNeededIconButton
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                k={props.k}
                buttonState={MyDocumentCardState}
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
      {ButttonRow_Uploaded}
      <Dialog
        open={MyDocumentCardState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Do you want to delete')} {props.docName}?
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
            color="primary"
            disabled={
              !MyDocumentCardState.isLoaded ||
              MyDocumentCardState.delete_field !== 'delete'
            }
            onClick={(e) => onDeleteFilefromstudent(e)}
            sx={{ mr: 1 }}
          >
            {!MyDocumentCardState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button variant="outlined" onClick={closeWarningWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={MyDocumentCardState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please give a reason why the uploaded
            {MyDocumentCardState.category} is invalied?
          </DialogContentText>
          <TextField
            id="rejectmessage"
            required
            fullWidth
            type="text"
            defaultValue={MyDocumentCardState.comments || ''}
            onChange={(e) => handleRejectMessage(e, e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={
              MyDocumentCardState.comments === '' ||
              !MyDocumentCardState.isLoaded
            }
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!MyDocumentCardState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Submit', { ns: 'common' })
            )}
          </Button>
          <Button onClick={closeRejectWarningWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={MyDocumentCardState.acceptProfileFileModel}
        onClose={closeAcceptWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {MyDocumentCardState.category} is a valid and can be used for the
            application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!MyDocumentCardState.isLoaded}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!MyDocumentCardState.isLoaded ? (
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
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={MyDocumentCardState.showPreview}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
      >
        <DialogTitle>{props.path}</DialogTitle>
        <FilePreview
          apiFilePath={`/api/students/${MyDocumentCardState.student_id.toString()}/files/${
            MyDocumentCardState.preview_path
          }`}
          path={MyDocumentCardState.preview_path}
        />
        <DialogContent>
          {is_TaiGer_AdminAgent(user) && (
            <>
              <Typography variant="body1" fontWeight="bold">
                {base_documents_checklist[props.k] &&
                  base_documents_checklist[props.k].length !== 0 &&
                  'Check list: Please check the following points so that you can flag this document as valid.'}
              </Typography>
              {base_documents_checklist[props.k]
                ? base_documents_checklist[props.k].map((check_item, i) => (
                    <FormControlLabel
                      key={i}
                      label={`${check_item}`}
                      control={
                        <Checkbox
                          id={`${check_item}-${i}`}
                          onChange={(e) => onChecked(e)}
                        />
                      }
                    />
                  ))
                : t('No', { ns: 'common' })}
            </>
          )}
          {props.path && props.path.split('.')[1] !== 'pdf' && (
            <a
              href={`${BASE_URL}/api/students/${MyDocumentCardState.student_id.toString()}/files/${
                props.path
              }`}
              download
              target="_blank"
              rel="noreferrer"
            >
              <Button
                color="primary"
                variant="contained"
                size="small"
                title="Download"
                startIcon={<FileDownloadIcon />}
              >
                {t('Download', { ns: 'common' })}
              </Button>
            </a>
          )}
        </DialogContent>
        <DialogActions>
          {is_TaiGer_AdminAgent(user) && (
            <>
              {props.status !== 'accepted' && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  title="Mark as finished"
                  disabled={
                    !MyDocumentCardState.isLoaded ||
                    MyDocumentCardState.num_points !==
                      MyDocumentCardState.checkedBoxes.length
                  }
                  onClick={(e) =>
                    onUpdateProfileDocStatus(
                      e,
                      props.k,
                      MyDocumentCardState.student_id,
                      'accepted'
                    )
                  }
                  startIcon={<CheckIcon />}
                  sx={{ mr: 2 }}
                >
                  {t('Accept', { ns: 'common' })}
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                size="small"
                title="Mark as reject"
                disabled={!MyDocumentCardState.isLoaded}
                onClick={(e) =>
                  onUpdateProfileDocStatus(
                    e,
                    props.k,
                    MyDocumentCardState.student_id,
                    'rejected'
                  )
                }
                startIcon={<CloseIcon />}
                sx={{ mr: 2 }}
              >
                {t('Reject', { ns: 'documents' })}
              </Button>
            </>
          )}
          <Button size="small" variant="outlined" onClick={closePreviewWindow}>
            {!MyDocumentCardState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Close', { ns: 'common' })
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={MyDocumentCardState.SetNeededWindow}
        onClose={closeSetNeededWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to set {MyDocumentCardState.category} as mandatory
            document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!MyDocumentCardState.isLoaded ? (
            <CircularProgress />
          ) : (
            <Button
              disabled={!MyDocumentCardState.isLoaded}
              onClick={(e) => onUpdateProfileFilefromstudent(e)}
            >
              {t('Yes', { ns: 'common' })}
            </Button>
          )}

          <Button onClick={closeSetNeededWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={MyDocumentCardState.setMissingWindow}
        onClose={closeSetMissingWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to set {MyDocumentCardState.category} unnecessary
            document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!MyDocumentCardState.isLoaded && <Loading />}
          <Button
            variant="contained"
            disabled={!MyDocumentCardState.isLoaded}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {t('Yes', { ns: 'common' })}
          </Button>
          <Button onClick={closeSetMissingWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <OffcanvasBaseDocument
        open={MyDocumentCardState.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={MyDocumentCardState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          MyDocumentCardState.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default MyDocumentCard;
