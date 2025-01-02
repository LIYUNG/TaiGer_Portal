import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import {
  DocumentStatusType,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '@taiger-common/core';

import { BASE_URL } from '../../api/request';
import FilePreview from '../../components/FilePreview/FilePreview';

import { useAuth } from '../../components/AuthProvider';

function AcceptProfileFileModel(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'xl'}
      open={props.showPreview}
      onClose={props.closePreviewWindow}
    >
      <DialogTitle>{props.path}</DialogTitle>
      <DialogContent>
        <FilePreview
          apiFilePath={`/api/students/${props.student_id.toString()}/files/${
            props.preview_path
          }`}
          path={props.preview_path}
        />
        {props.path?.split('.')[1] !== 'pdf' && (
          <a
            href={`${BASE_URL}/api/students/${props.student_id?.toString()}/files/${
              props.path
            }`}
            download
            target="_blank"
            rel="noopener noreferrer"
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
      </DialogContent>
      <DialogActions>
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
                DocumentStatusType.Rejected
              )
            }
            startIcon={<CloseIcon />}
            sx={{ mr: 2 }}
          >
            {t('Reject', { ns: 'documents' })}
          </Button>
        )}
        <Button
          size="small"
          color="primary"
          variant="contained"
          title="Download"
          startIcon={<FileDownloadIcon />}
          onClick={props.closePreviewWindow}
        >
          {t('Download', { ns: 'common' })}
        </Button>
        <Button onClick={props.closePreviewWindow}>
          {!props.isLoaded ? (
            <CircularProgress />
          ) : (
            t('Close', { ns: 'common' })
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AcceptProfileFileModel;
