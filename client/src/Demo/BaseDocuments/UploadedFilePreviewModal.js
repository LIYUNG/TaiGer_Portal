import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import { base_documents_checklist } from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import FilePreview from '../../components/FilePreview/FilePreview';
import { BASE_URL } from '../../api/request';

function UploadedFilePreviewModal(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [UploadedFilePreviewModalState, setUploadedFilePreviewModalState] =
    useState({
      student: props.student,
      link: props.link,
      student_id: props.student._id.toString(),
      category: '',
      docName: '',
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
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.isLoaded]);
  useEffect(() => {
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded,
      student_id: props.student._id.toString()
    }));
  }, [props.student._id]);

  const closePreviewWindow = () => {
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const closeRejectWarningWindow = () => {
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const closeAcceptWarningWindow = () => {
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      acceptProfileFileModel: false
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setUploadedFilePreviewModalState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setUploadedFilePreviewModalState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    props.onUpdateProfileFilefromstudent(
      UploadedFilePreviewModalState.category,
      UploadedFilePreviewModalState.student_id,
      UploadedFilePreviewModalState.status,
      UploadedFilePreviewModalState.feedback
    );
  };

  const onChecked = (e) => {
    const id = e.target.id;
    const isChecked = e.target.checked;
    const temp_checkedBoxes = [...UploadedFilePreviewModalState.checkedBoxes];
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

    setUploadedFilePreviewModalState((prevState) => ({
      ...prevState,
      checkedBoxes: temp_checkedBoxes
    }));
  };

  return (
    <>
      <ModalNew
        open={UploadedFilePreviewModalState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('Warning', { ns: 'common' })}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Please give a reason why the uploaded
          {UploadedFilePreviewModalState.category} is invalied?
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
            UploadedFilePreviewModalState.feedback === '' ||
            !UploadedFilePreviewModalState.isLoaded
          }
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {!UploadedFilePreviewModalState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Submit', { ns: 'common' })
          )}
        </Button>
        <Button onClick={closeRejectWarningWindow}>No</Button>
      </ModalNew>
      <ModalNew
        open={UploadedFilePreviewModalState.acceptProfileFileModel}
        onClose={closeAcceptWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h5">Warning</Typography>

        <Typography sx={{ my: 2 }}>
          {UploadedFilePreviewModalState.category} is a valid and can be used
          for the application?
        </Typography>

        <Button
          color="primary"
          variant="contained"
          disabled={!UploadedFilePreviewModalState.isLoaded}
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {!UploadedFilePreviewModalState.isLoaded ? (
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
        open={UploadedFilePreviewModalState.showPreview}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
        width="100%"
        size="xl"
      >
        <Typography id="contained-d-title-vcenter">{props.path}</Typography>
        <Typography>
          <FilePreview
            path={UploadedFilePreviewModalState.preview_path}
            student_id={UploadedFilePreviewModalState.student_id.toString()}
          />
        </Typography>
        {is_TaiGer_AdminAgent(user) && (
          <>
            <Typography variant="body1" fontWeight="bold">
              {base_documents_checklist[props.k] &&
                base_documents_checklist[props.k].length !== 0 &&
                'Check list: Please check the following points so that you can flag this document as valid.'}
            </Typography>
            <Typography>
              {base_documents_checklist[props.k]
                ? base_documents_checklist[props.k].map((check_item, i) => (
                    <Form.Check
                      key={i}
                      type={'checkbox'}
                      id={`${check_item}-${i}`}
                      label={`${check_item}`}
                      onChange={(e) => onChecked(e)}
                    />
                  ))
                : t('No', { ns: 'common' })}
            </Typography>
          </>
        )}
        {props.path.split('.')[1] !== 'pdf' && (
          <a
            href={`${BASE_URL}/api/students/${UploadedFilePreviewModalState.student_id.toString()}/files/${
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
                !UploadedFilePreviewModalState.isLoaded ||
                UploadedFilePreviewModalState.num_points !==
                  UploadedFilePreviewModalState.checkedBoxes.length
              }
              onClick={(e) =>
                onUpdateProfileDocStatus(
                  e,
                  props.k,
                  UploadedFilePreviewModalState.student_id,
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
              disabled={!UploadedFilePreviewModalState.isLoaded}
              onClick={(e) =>
                onUpdateProfileDocStatus(
                  e,
                  props.k,
                  UploadedFilePreviewModalState.student_id,
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
          {!UploadedFilePreviewModalState.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            t('Close', { ns: 'common' })
          )}
        </Button>
      </ModalNew>
    </>
  );
}

export default UploadedFilePreviewModal;
