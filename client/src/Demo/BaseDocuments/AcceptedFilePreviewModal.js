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

const AcceptProfileFileModel = ({
    closePreviewWindow,
    showPreview,
    path,
    k,
    onUpdateProfileDocStatus,
    isLoaded,
    student_id,
    preview_path
}) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <Dialog
            fullWidth={true}
            maxWidth="xl"
            onClose={closePreviewWindow}
            open={showPreview}
        >
            <DialogTitle>{path}</DialogTitle>
            <DialogContent>
                <FilePreview
                    apiFilePath={`/api/students/${student_id.toString()}/files/${
                        preview_path
                    }`}
                    path={preview_path}
                />
                {path?.split('.')[1] !== 'pdf' ? (
                    <a
                        download
                        href={`${BASE_URL}/api/students/${student_id?.toString()}/files/${
                            path
                        }`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Button
                            color="primary"
                            size="small"
                            startIcon={<FileDownloadIcon />}
                            title="Download"
                            variant="contained"
                        >
                            {t('Download', { ns: 'common' })}
                        </Button>
                    </a>
                ) : null}
            </DialogContent>
            <DialogActions>
                {!(is_TaiGer_Editor(user) || is_TaiGer_Student(user)) ? (
                    <Button
                        color="secondary"
                        disabled={!isLoaded}
                        onClick={(e) =>
                            onUpdateProfileDocStatus(
                                e,
                                k,
                                student_id,
                                DocumentStatusType.Rejected
                            )
                        }
                        size="small"
                        startIcon={<CloseIcon />}
                        sx={{ mr: 2 }}
                        variant="contained"
                    >
                        {t('Reject', { ns: 'documents' })}
                    </Button>
                ) : null}
                <Button
                    color="primary"
                    onClick={closePreviewWindow}
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    title="Download"
                    variant="contained"
                >
                    {t('Download', { ns: 'common' })}
                </Button>
                <Button onClick={closePreviewWindow}>
                    {!isLoaded ? (
                        <CircularProgress />
                    ) : (
                        t('Close', { ns: 'common' })
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AcceptProfileFileModel;
