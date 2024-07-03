import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
  is_TaiGer_Editor
} from '../Utils/checking-functions';
import {
  FILE_UPLOADED_SYMBOL,
  base_documents_checklist,
  convertDate
} from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import FilePreview from '../../components/FilePreview/FilePreview';
import { BASE_URL } from '../../api/request';
import {
  DeleteIconButton,
  DownloadIconButton
} from '../../components/Buttons/Button';

function ButtonSetUploaded(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [ButtonSetUploadedState, setButtonSetUploadedState] = useState({
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    docName: '',
    comments: '',
    file: '',
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
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  });

  useEffect(() => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.isLoaded]);
  useEffect(() => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.student._id]);

  const closeOffcanvasWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };

  const openOffcanvasWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeWarningWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false
    }));
  };

  const closePreviewWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const showPreview = (e, path) => {
    e.preventDefault();
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path
    }));
  };

  const closeRejectWarningWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const closeAcceptWarningWindow = () => {
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      acceptProfileFileModel: false
    }));
  };

  const onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setButtonSetUploadedState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setButtonSetUploadedState((prevState) => ({
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
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(ButtonSetUploadedState.link, props.k);
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  const onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    props.onDeleteFilefromstudent(
      ButtonSetUploadedState.category,
      ButtonSetUploadedState.student_id
    );
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    props.onUpdateProfileFilefromstudent(
      ButtonSetUploadedState.category,
      ButtonSetUploadedState.student_id,
      ButtonSetUploadedState.status,
      ButtonSetUploadedState.feedback
    );
  };

  const onChecked = (e) => {
    const id = e.target.id;
    const isChecked = e.target.checked;
    const temp_checkedBoxes = [...ButtonSetUploadedState.checkedBoxes];
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

    setButtonSetUploadedState((prevState) => ({
      ...prevState,
      checkedBoxes: temp_checkedBoxes
    }));
  };

  var ButttonRow_Uploaded;
  ButttonRow_Uploaded = (
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
        <Grid item xs={12} sm={8}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {FILE_UPLOADED_SYMBOL}
            <Typography variant="body1">
              {t(props.docName, { ns: 'common' })}
            </Typography>
            <Tooltip title={t('Read More')}>
              <IconButton
                component={LinkDom}
                to={
                  ButtonSetUploadedState.link &&
                  ButtonSetUploadedState.link !== ''
                    ? ButtonSetUploadedState.link
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
        <Grid item xs={12} sm={4}>
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
            {!is_TaiGer_Editor(user) && (
              <DeleteIconButton
                isLoaded={ButtonSetUploadedState.isLoaded}
                onDeleteFileWarningPopUp={onDeleteFileWarningPopUp}
                k={props.k}
                student_id={ButtonSetUploadedState.student_id}
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
      {ButttonRow_Uploaded}
      <ModalNew
        open={ButtonSetUploadedState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">{t('Warning', { ns: 'common' })}</Typography>
        <Typography sx={{ py: 2 }}>
          {t('Do you want to delete')} {props.docName}?
        </Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={!ButtonSetUploadedState.isLoaded}
          onClick={(e) => onDeleteFilefromstudent(e)}
          sx={{ mr: 1 }}
        >
          {!ButtonSetUploadedState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Yes', { ns: 'common' })
          )}
        </Button>
        <Button variant="outlined" onClick={closeWarningWindow}>
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={ButtonSetUploadedState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('Warning', { ns: 'common' })}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Please give a reason why the uploaded
          {ButtonSetUploadedState.category} is invalied?
        </Typography>
        <TextField
          id="rejectmessage"
          required
          fullWidth
          type="text"
          onChange={(e) => handleRejectMessage(e, e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          color="primary"
          variant="contained"
          disabled={
            ButtonSetUploadedState.feedback === '' ||
            !ButtonSetUploadedState.isLoaded
          }
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {!ButtonSetUploadedState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Submit', { ns: 'common' })
          )}
        </Button>
        <Button onClick={closeRejectWarningWindow}>No</Button>
      </ModalNew>
      <ModalNew
        open={ButtonSetUploadedState.acceptProfileFileModel}
        onClose={closeAcceptWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h5">Warning</Typography>

        <Typography sx={{ my: 2 }}>
          {ButtonSetUploadedState.category} is a valid and can be used for the
          application?
        </Typography>

        <Button
          color="primary"
          variant="contained"
          disabled={!ButtonSetUploadedState.isLoaded}
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {!ButtonSetUploadedState.isLoaded ? (
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
      <ModalNew
        open={ButtonSetUploadedState.showPreview}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
        width="100%"
        size="xl"
      >
        <Typography id="contained-d-title-vcenter">{props.path}</Typography>
        <Typography>
          <FilePreview
            path={ButtonSetUploadedState.preview_path}
            student_id={ButtonSetUploadedState.student_id.toString()}
          />
        </Typography>
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
        {props.path.split('.')[1] !== 'pdf' && (
          <a
            href={`${BASE_URL}/api/students/${ButtonSetUploadedState.student_id.toString()}/files/${
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
        {is_TaiGer_AdminAgent(user) && (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              title="Mark as finished"
              disabled={
                !ButtonSetUploadedState.isLoaded ||
                ButtonSetUploadedState.num_points !==
                  ButtonSetUploadedState.checkedBoxes.length
              }
              onClick={(e) =>
                onUpdateProfileDocStatus(
                  e,
                  props.k,
                  ButtonSetUploadedState.student_id,
                  'accepted'
                )
              }
              startIcon={<CheckIcon />}
              sx={{ mr: 2 }}
            >
              {t('Accept', { ns: 'common' })}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              title="Mark as reject"
              disabled={!ButtonSetUploadedState.isLoaded}
              onClick={(e) =>
                onUpdateProfileDocStatus(
                  e,
                  props.k,
                  ButtonSetUploadedState.student_id,
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
          {!ButtonSetUploadedState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Close', { ns: 'common' })
          )}
        </Button>
      </ModalNew>
      <OffcanvasBaseDocument
        open={ButtonSetUploadedState.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={ButtonSetUploadedState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          ButtonSetUploadedState.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default ButtonSetUploaded;
