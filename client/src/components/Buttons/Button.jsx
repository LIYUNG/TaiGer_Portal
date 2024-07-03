import React from 'react';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NotInterestedIcon from '@mui/icons-material/NotInterested'; // using an icon to represent "Set Not Needed"
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // using an icon to represent "Set Needed"

import { VisuallyHiddenInput } from '../Input';

export const DownloadIconButton = ({ showPreview, path, t }) => (
  <Tooltip title={t('Download', { ns: 'common' })}>
    <IconButton onClick={(e) => showPreview(e, path)}>
      <FileDownloadIcon />
    </IconButton>
  </Tooltip>
);

export const DeleteIconButton = ({
  isLoaded,
  onDeleteFileWarningPopUp,
  k,
  student_id,
  docName,
  t
}) => (
  <Tooltip title={t('Delete', { ns: 'common' })}>
    <span>
      <IconButton
        color="error"
        type="submit"
        disabled={!isLoaded}
        onClick={(e) => onDeleteFileWarningPopUp(e, k, student_id, docName)}
      >
        <DeleteIcon />
      </IconButton>
    </span>
  </Tooltip>
);

export const UploadIconButton = ({
  buttonState,
  t,
  handleGeneralDocSubmit,
  k
}) => {
  return !buttonState.isLoaded ? (
    <CircularProgress size={24} />
  ) : (
    <Tooltip title={t('Upload', { ns: 'common' })}>
      <label>
        <IconButton component="span" variant="outlined">
          <CloudUploadIcon />
        </IconButton>
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => handleGeneralDocSubmit(e, k, buttonState.student_id)}
        />
      </label>
    </Tooltip>
  );
};

export const SetNotNeededIconButton = ({
  onUpdateProfileDocStatus,
  k,
  buttonState,
  t
}) => (
  <Tooltip title={t('Set Not Needed', { ns: 'common' })}>
    <IconButton
      color="secondary"
      onClick={(e) =>
        onUpdateProfileDocStatus(e, k, buttonState.student_id, 'notneeded')
      }
    >
      <NotInterestedIcon />
    </IconButton>
  </Tooltip>
);

export const SetNeededIconButton = ({
  onUpdateProfileDocStatus,
  k,
  buttonState,
  t
}) => (
  <Tooltip title={t('Set Needed', { ns: 'common' })}>
    <IconButton
      color="secondary"
      onClick={(e) =>
        onUpdateProfileDocStatus(e, k, buttonState.student_id, 'missing')
      }
    >
      <AssignmentTurnedInIcon />
    </IconButton>
  </Tooltip>
);
