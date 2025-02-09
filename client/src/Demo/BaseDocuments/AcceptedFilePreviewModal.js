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

const AcceptProfileFileModel = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <Dialog
            fullWidth={true}
            maxWidth="xl"
            onClose={props.closePreviewWindow}
            open={props.showPreview}
        >
            <DialogTitle>{props.path}</DialogTitle>
            <DialogContent>
                <FilePreview
                    apiFilePath={`/api/students/${props.student_id.toString()}/files/${
                        props.preview_path
                    }`}
                    path={props.preview_path}
                />
                {props.path?.split('.')[1] !== 'pdf' ? <a
                        download
                        href={`${BASE_URL}/api/students/${props.student_id?.toString()}/files/${
                            props.path
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
                    </a> : null}
            </DialogContent>
            <DialogActions>
                {!(is_TaiGer_Editor(user) || is_TaiGer_Student(user)) ? <Button
                        color="secondary"
                        disabled={!props.isLoaded}
                        onClick={(e) =>
                            props.onUpdateProfileDocStatus(
                                e,
                                props.k,
                                props.student_id,
                                DocumentStatusType.Rejected
                            )
                        }
                        size="small"
                        startIcon={<CloseIcon />}
                        sx={{ mr: 2 }}
                        variant="contained"
                    >
                        {t('Reject', { ns: 'documents' })}
                    </Button> : null}
                <Button
                    color="primary"
                    onClick={props.closePreviewWindow}
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    title="Download"
                    variant="contained"
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
