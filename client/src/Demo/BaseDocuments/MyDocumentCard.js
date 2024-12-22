import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Alert,
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
  Snackbar,
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
import {
  DocumentStatusType,
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '@taiger-common/core';

import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
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
import Loading from '../../components/Loading/Loading';
import { useMutation } from '@tanstack/react-query';
import { updateProfileDocumentStatusV2 } from '../../api';
import { queryClient } from '../../api/client';

function MyDocumentCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState(props.status);
  const [rejectProfileFileModelOpen, setRejectProfileFileModelOpen] =
    useState(false);
  const [acceptProfileFileModelOpen, setAcceptProfileFileModelOpen] =
    useState(false);
  const [missingWindowOpen, setMissingWindowOpen] = useState(false);
  const [neededWindowOpen, setNeededWindowOpen] = useState(false);
  const [baseDocsflagOffcanvas, setBaseDocsflagOffcanvas] = useState(false);
  const [
    baseDocsflagOffcanvasButtonDisable,
    setBaseDocsflagOffcanvasButtonDisable
  ] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'
  const [message, setMessage] = useState('');

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
    preview_path: '#',
    num_points: base_documents_checklist[props.k]
      ? base_documents_checklist[props.k].length
      : 0,
    num_checked_points: 0,
    checkedBoxes: []
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileDocumentStatusV2,
    onError: (error) => {
      setSeverity('error');
      setMessage(error.message || 'An error occurred. Please try again.');
      setOpenSnackbar(true);
    },
    onSuccess: () => {
      setSeverity('success');
      setMessage('Update file status successfully!');
      // TODO: upload local state: could be improved, see udemy(doest not need to wait onSuccess!)
      setStatus(MyDocumentCardState.status);
      queryClient.invalidateQueries({ queryKey: ['students/doc-links'] });
      setOpenSnackbar(true);
      setMissingWindowOpen(false);
      setNeededWindowOpen(false);
      setRejectProfileFileModelOpen(false);
      setAcceptProfileFileModelOpen(false);
      setShowPreview(false);
    }
  });

  const onUpdateProfileFilefromstudent2 = (e) => {
    e.preventDefault();
    mutate({
      category: MyDocumentCardState.category,
      student_id: MyDocumentCardState.student_id,
      status: MyDocumentCardState.status,
      feedback: MyDocumentCardState.comments
    });
  };

  const closeWarningWindow = () => {
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
  };

  const showPreviewD = (e, path) => {
    e.preventDefault();
    setShowPreview(true);
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      preview_path: path
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
    if (status === DocumentStatusType.Accepted) {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status
      }));
      setAcceptProfileFileModelOpen(true);
    } else if (status === DocumentStatusType.Missing) {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status
      }));
      setNeededWindowOpen(true);
    } else if (status === DocumentStatusType.NotNeeded) {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status
      }));
      setMissingWindowOpen(true);
    } else {
      setMyDocumentCardState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status
      }));
      setRejectProfileFileModelOpen(true);
    }
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setBaseDocsflagOffcanvas(true);

    props.updateDocLink(MyDocumentCardState.link, props.k);
    setBaseDocsflagOffcanvas(false);
    setBaseDocsflagOffcanvasButtonDisable(false);
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
    setRejectProfileFileModelOpen(true);
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      status: DocumentStatusType.Rejected,
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

  const handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    setMyDocumentCardState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.handleGeneralDocSubmit(e, k, student_id);
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
    if (status === DocumentStatusType.Uploaded) {
      return FILE_UPLOADED_SYMBOL;
    } else if (status === DocumentStatusType.Accepted) {
      return FILE_OK_SYMBOL;
    } else if (status === DocumentStatusType.Rejected) {
      return FILE_NOT_OK_SYMBOL;
    } else if (status === DocumentStatusType.NotNeeded) {
      return FILE_DONT_CARE_SYMBOL;
    } else if (status === DocumentStatusType.Missing) {
      return FILE_MISSING_SYMBOL;
    }
  };

  const ButttonRow_Uploaded = ((status === DocumentStatusType.NotNeeded &&
    is_TaiGer_AdminAgent(user)) ||
    status === DocumentStatusType.Uploaded ||
    status === DocumentStatusType.Rejected ||
    status === DocumentStatusType.Missing ||
    status === DocumentStatusType.Accepted) && (
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
                onClick={() => setBaseDocsflagOffcanvas(true)}
                sx={{ cursor: 'pointer', ml: 1 }}
                color="primary"
              >
                [Edit]
              </Typography>
            )}
          </Stack>
          {status === DocumentStatusType.Rejected && (
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
            {(status === DocumentStatusType.Missing ||
              status === DocumentStatusType.NotNeeded) &&
              (is_TaiGer_Student(user) || is_TaiGer_AdminAgent(user)) && (
                <UploadIconButton
                  user={user}
                  buttonState={MyDocumentCardState}
                  t={t}
                  handleGeneralDocSubmit={handleGeneralDocSubmit}
                  k={props.k}
                />
              )}
            {(status === DocumentStatusType.Rejected ||
              status === DocumentStatusType.Uploaded ||
              status === DocumentStatusType.Accepted) && (
              <DownloadIconButton
                showPreview={showPreviewD}
                path={props.path}
                t={t}
              />
            )}
            {status === DocumentStatusType.Rejected &&
              !is_TaiGer_Student(user) && (
                <CommentsIconButton
                  buttonState={MyDocumentCardState}
                  openCommentWindow={openCommentWindow}
                  k={props.k}
                  t={t}
                />
              )}
            {status === DocumentStatusType.NotNeeded && (
              <SetNeededIconButton
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                k={props.k}
                buttonState={MyDocumentCardState}
                t={t}
              />
            )}
            {(status === DocumentStatusType.Uploaded ||
              status === DocumentStatusType.Rejected ||
              (status === DocumentStatusType.Accepted &&
                is_TaiGer_AdminAgent(user))) &&
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
            {status === DocumentStatusType.Missing &&
              is_TaiGer_AdminAgent(user) && (
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
              <CircularProgress size={16} />
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
        open={rejectProfileFileModelOpen}
        onClose={() => setRejectProfileFileModelOpen(false)}
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
            disabled={MyDocumentCardState.comments === '' || isPending}
            onClick={(e) => onUpdateProfileFilefromstudent2(e)}
          >
            {isPending ? (
              <CircularProgress size={16} />
            ) : (
              t('Submit', { ns: 'common' })
            )}
          </Button>
          <Button onClick={() => setRejectProfileFileModelOpen(false)}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={acceptProfileFileModelOpen}
        onClose={() => setAcceptProfileFileModelOpen(false)}
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
            disabled={isPending}
            onClick={(e) => onUpdateProfileFilefromstudent2(e)}
          >
            {isPending ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setAcceptProfileFileModelOpen(false)}
          >
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={showPreview}
        onClose={() => setShowPreview(false)}
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
              {status !== DocumentStatusType.Accepted && (
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
                      DocumentStatusType.Accepted
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
                    DocumentStatusType.Rejected
                  )
                }
                startIcon={<CloseIcon />}
                sx={{ mr: 2 }}
              >
                {t('Reject', { ns: 'documents' })}
              </Button>
            </>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowPreview(false)}
          >
            {!MyDocumentCardState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Close', { ns: 'common' })
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={neededWindowOpen}
        onClose={() => setNeededWindowOpen(false)}
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
          {isPending ? (
            <CircularProgress />
          ) : (
            <Button
              disabled={isPending}
              onClick={(e) => onUpdateProfileFilefromstudent2(e)}
            >
              {t('Yes', { ns: 'common' })}
            </Button>
          )}

          <Button onClick={() => setNeededWindowOpen(false)}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={missingWindowOpen}
        onClose={() => setMissingWindowOpen(false)}
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
          {isPending && <Loading />}
          <Button
            variant="contained"
            disabled={isPending}
            onClick={(e) => onUpdateProfileFilefromstudent2(e)}
          >
            {t('Yes', { ns: 'common' })}
          </Button>
          <Button onClick={() => setMissingWindowOpen(false)}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <OffcanvasBaseDocument
        open={baseDocsflagOffcanvas}
        onHide={() => setBaseDocsflagOffcanvas(false)}
        link={MyDocumentCardState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={baseDocsflagOffcanvasButtonDisable}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MyDocumentCard;
