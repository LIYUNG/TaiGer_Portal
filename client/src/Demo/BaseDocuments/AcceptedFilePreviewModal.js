import React from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';

import { BASE_URL } from '../../api/request';
import FilePreview from '../../components/FilePreview/FilePreview';
import {
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';

function AcceptProfileFileModel(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ModalNew
      open={props.showPreview}
      onClose={props.closePreviewWindow}
      aria-labelledby="contained-modal-title-vcenter2"
    >
      <Typography id="contained-d-title-vcenter">{props.path}</Typography>
      <FilePreview
        path={props.preview_path}
        student_id={props.student_id.toString()}
      />
      {props.path.split('.')[1] !== 'pdf' && (
        <a
          href={`${BASE_URL}/api/students/${props.student_id.toString()}/files/${
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
          disabled={!props.isLoaded}
          onClick={(e) =>
            props.onUpdateProfileDocStatus(
              e,
              props.k,
              props.student_id,
              'rejected'
            )
          }
          startIcon={<CloseIcon />}
          sx={{ mr: 2 }}
        >
          {t('Reject')}
        </Button>
      )}
      <Button
        size="small"
        variant="outlined"
        onClick={props.closePreviewWindow}
      >
        {!props.isLoaded ? <CircularProgress /> : t('Close')}
      </Button>
    </ModalNew>
  );
}

export default AcceptProfileFileModel;
