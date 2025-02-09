import React from 'react';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NotInterestedIcon from '@mui/icons-material/NotInterested'; // using an icon to represent "Set Not Needed"
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // using an icon to represent "Set Needed"
import MessageIcon from '@mui/icons-material/Message';
import i18next from 'i18next';

import { DocumentStatusType } from '@taiger-common/core';

export const DownloadIconButton = ({ showPreview }) => (
    <Tooltip title={i18next.t('Download', { ns: 'common' })}>
        <IconButton onClick={showPreview}>
            <FileDownloadIcon />
        </IconButton>
    </Tooltip>
);

export const CommentsIconButton = ({
    openCommentWindow,
    buttonState,
    category
}) => (
    <Tooltip title={i18next.t('Show Comments', { ns: 'common' })}>
        <IconButton
            onClick={() => openCommentWindow(buttonState.student_id, category)}
        >
            <MessageIcon />
        </IconButton>
    </Tooltip>
);

export const DeleteIconButton = ({
    isLoading,
    onDeleteFileWarningPopUp,
    category,
    student_id,
    docName
}) => (
    <Tooltip title={i18next.t('Delete', { ns: 'common' })}>
        <span>
            <IconButton
                color="error"
                disabled={isLoading}
                onClick={(e) =>
                    onDeleteFileWarningPopUp(e, category, student_id, docName)
                }
                type="submit"
            >
                <DeleteIcon />
            </IconButton>
        </span>
    </Tooltip>
);

export const UploadIconButton = ({
    isLoading,
    buttonState,
    handleGeneralDocSubmit,
    category
}) => {
    return isLoading ? (
        <CircularProgress size={24} />
    ) : (
        <Tooltip title={i18next.t('Upload', { ns: 'common' })}>
            <label>
                <IconButton component="span" variant="outlined">
                    <CloudUploadIcon />
                </IconButton>
                <input
                    hidden
                    onChange={(e) =>
                        handleGeneralDocSubmit(
                            e,
                            category,
                            buttonState.student_id
                        )
                    }
                    type="file"
                />
            </label>
        </Tooltip>
    );
};

export const SetNotNeededIconButton = ({
    onUpdateProfileDocStatus,
    category,
    buttonState
}) => (
    <Tooltip title={i18next.t('Set Not Needed', { ns: 'common' })}>
        <IconButton
            color="secondary"
            onClick={(e) =>
                onUpdateProfileDocStatus(
                    e,
                    category,
                    buttonState.student_id,
                    DocumentStatusType.NotNeeded
                )
            }
        >
            <NotInterestedIcon />
        </IconButton>
    </Tooltip>
);

export const SetNeededIconButton = ({
    onUpdateProfileDocStatus,
    category,
    buttonState
}) => (
    <Tooltip title={i18next.t('Set Needed', { ns: 'common' })}>
        <IconButton
            color="secondary"
            onClick={(e) =>
                onUpdateProfileDocStatus(
                    e,
                    category,
                    buttonState.student_id,
                    DocumentStatusType.Missing
                )
            }
        >
            <AssignmentTurnedInIcon />
        </IconButton>
    </Tooltip>
);
