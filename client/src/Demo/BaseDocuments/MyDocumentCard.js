import React, { useState } from 'react';
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
} from '../../utils/contants';
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
import {
    deleteFileV2,
    updateProfileDocumentStatusV2,
    uploadforstudentV2
} from '../../api';
import { queryClient } from '../../api/client';
import { useSnackBar } from '../../contexts/use-snack-bar';
import i18next from 'i18next';

const StatusIcon = ({ st }) => {
    if (st === DocumentStatusType.Uploaded) {
        return FILE_UPLOADED_SYMBOL;
    } else if (st === DocumentStatusType.Accepted) {
        return FILE_OK_SYMBOL;
    } else if (st === DocumentStatusType.Rejected) {
        return FILE_NOT_OK_SYMBOL;
    } else if (st === DocumentStatusType.NotNeeded) {
        return FILE_DONT_CARE_SYMBOL;
    } else if (st === DocumentStatusType.Missing) {
        return FILE_MISSING_SYMBOL;
    }
};

const SingleDocumentCard = ({
    st,
    isUploadingFile,
    onDeleteFileWarningPopUp,
    category,
    user,
    link,
    docName,
    isDeletingFile,
    comments,
    setShowPreview,
    time,
    MyDocumentCardState,
    openCommentWindow,
    handleGeneralDocSubmitV2,
    onUpdateProfileDocStatus,
    setBaseDocsflagOffcanvas
}) => {
    return (st === DocumentStatusType.NotNeeded &&
        is_TaiGer_AdminAgent(user)) ||
        st === DocumentStatusType.Uploaded ||
        st === DocumentStatusType.Rejected ||
        st === DocumentStatusType.Missing ||
        st === DocumentStatusType.Accepted ? (
        <Box
            sx={{
                mb: 1,
                p: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2
            }}
        >
            <Grid alignItems="center" container spacing={2}>
                <Grid item sm={8} xs={8}>
                    <Stack alignItems="center" direction="row" spacing={1}>
                        <StatusIcon st={st} />
                        <Typography variant="body1">
                            {i18next.t(docName, { ns: 'common' })}
                        </Typography>
                        <Tooltip title={i18next.t('Read More')}>
                            <IconButton
                                color="primary"
                                component={LinkDom}
                                size="small"
                                target="_blank"
                                to={link && link !== '' ? link : '/'}
                            >
                                <LaunchIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {is_TaiGer_Admin(user) ? (
                            <Typography
                                color="primary"
                                component="a"
                                onClick={() => setBaseDocsflagOffcanvas(true)}
                            >
                                {i18next.t('Edit', { ns: 'common' })}
                            </Typography>
                        ) : null}
                    </Stack>
                    {st === DocumentStatusType.Rejected ? (
                        <Typography fontWeight="bold" variant="body2">
                            {i18next.t('Message', { ns: 'common' })}: {comments}
                        </Typography>
                    ) : null}
                    <Typography color="textSecondary" variant="body2">
                        {convertDate(time)}
                    </Typography>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        {(st === DocumentStatusType.Missing ||
                            st === DocumentStatusType.NotNeeded) &&
                        (is_TaiGer_Student(user) ||
                            is_TaiGer_AdminAgent(user)) ? (
                            <UploadIconButton
                                buttonState={MyDocumentCardState}
                                category={category}
                                handleGeneralDocSubmit={
                                    handleGeneralDocSubmitV2
                                }
                                isLoading={isUploadingFile}
                                user={user}
                            />
                        ) : null}
                        {st === DocumentStatusType.Rejected ||
                        st === DocumentStatusType.Uploaded ||
                        st === DocumentStatusType.Accepted ? (
                            <DownloadIconButton
                                showPreview={() => setShowPreview(true)}
                            />
                        ) : null}
                        {st === DocumentStatusType.Rejected &&
                        !is_TaiGer_Student(user) ? (
                            <CommentsIconButton
                                buttonState={MyDocumentCardState}
                                category={category}
                                openCommentWindow={openCommentWindow}
                            />
                        ) : null}
                        {st === DocumentStatusType.NotNeeded ? (
                            <SetNeededIconButton
                                buttonState={MyDocumentCardState}
                                category={category}
                                onUpdateProfileDocStatus={
                                    onUpdateProfileDocStatus
                                }
                            />
                        ) : null}
                        {(st === DocumentStatusType.Uploaded ||
                            st === DocumentStatusType.Rejected ||
                            (st === DocumentStatusType.Accepted &&
                                is_TaiGer_AdminAgent(user))) &&
                        !is_TaiGer_Editor(user) ? (
                            <DeleteIconButton
                                category={category}
                                docName={docName}
                                isLoading={isDeletingFile}
                                onDeleteFileWarningPopUp={
                                    onDeleteFileWarningPopUp
                                }
                                student_id={MyDocumentCardState.student_id}
                            />
                        ) : null}
                        {st === DocumentStatusType.Missing &&
                        is_TaiGer_AdminAgent(user) ? (
                            <SetNotNeededIconButton
                                buttonState={MyDocumentCardState}
                                category={category}
                                onUpdateProfileDocStatus={
                                    onUpdateProfileDocStatus
                                }
                            />
                        ) : null}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    ) : null;
};

const MyDocumentCard = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [showPreview, setShowPreview] = useState(false);
    const [status, setStatus] = useState(props.status);
    const [fileName, setFileName] = useState(props.document_name);
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
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

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
        num_points: base_documents_checklist[props.category]
            ? base_documents_checklist[props.category].length
            : 0,
        num_checked_points: 0,
        checkedBoxes: []
    });

    const apiPath = `/api/students/${MyDocumentCardState.student_id.toString()}/files/${
        fileName
    }`;

    const { mutate, isPending } = useMutation({
        mutationFn: updateProfileDocumentStatusV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: ({ data }) => {
            setSeverity('success');
            setMessage('Update file status successfully!');
            setStatus(data.status);
            const fileName = data.path?.replace(/\\/g, '/').split('/')[1];
            setFileName(fileName);
            queryClient.invalidateQueries({ queryKey: ['students/doc-links'] });
            setOpenSnackbar(true);

            setMissingWindowOpen(false);
            setNeededWindowOpen(false);
            setRejectProfileFileModelOpen(false);
            setAcceptProfileFileModelOpen(false);
            setShowPreview(false);
        }
    });

    const { mutate: mutateUploadFile, isPending: isUploadingFile } =
        useMutation({
            mutationFn: uploadforstudentV2,
            onError: (error) => {
                setSeverity('error');
                setMessage(
                    error.message || 'An error occurred. Please try again.'
                );
                setOpenSnackbar(true);
            },
            onSuccess: ({ data }) => {
                setSeverity('success');
                setMessage(
                    'Uploaded file successfully. Your agent is informed and will check it as soon as possible.'
                );
                setStatus(data.status);
                const fileName = data.path.split('/')[1];
                setFileName(fileName);
                queryClient.invalidateQueries({
                    queryKey: ['students/doc-links']
                });
                setOpenSnackbar(true);
            }
        });

    const { mutate: mutateDeleteFile, isPending: isDeletingFile } = useMutation(
        {
            mutationFn: deleteFileV2,
            onError: (error) => {
                setSeverity('error');
                setMessage(
                    error.message || 'An error occurred. Please try again.'
                );
                setOpenSnackbar(true);
            },
            onSuccess: ({ data }) => {
                setSeverity('success');
                setMessage('Deleted file successfully.');
                setStatus(data.status);
                setMyDocumentCardState((prevState) => ({
                    ...prevState,
                    deleteFileWarningModel: false
                }));
                const fileName = data.path.split('/')[1];
                setFileName(fileName);
                queryClient.invalidateQueries({
                    queryKey: ['students/doc-links']
                });
                setOpenSnackbar(true);
            }
        }
    );

    const onUpdateProfileFilefromstudent2 = () => {
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
        setMyDocumentCardState((prevState) => ({
            ...prevState,
            student_id,
            category,
            status
        }));
        if (status === DocumentStatusType.Accepted) {
            setAcceptProfileFileModelOpen(true);
        } else if (status === DocumentStatusType.Missing) {
            setNeededWindowOpen(true);
        } else if (status === DocumentStatusType.NotNeeded) {
            setMissingWindowOpen(true);
        } else {
            setRejectProfileFileModelOpen(true);
        }
    };

    const updateDocLink = (e) => {
        e.preventDefault();
        setBaseDocsflagOffcanvas(true);

        props.updateDocLink(MyDocumentCardState.link, props.category);
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
    const handleGeneralDocSubmitV2 = (e, category, studentId) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        mutateUploadFile({ category, studentId, formData });
    };

    const onDeleteFilefromstudentV2 = (e) => {
        e.preventDefault();
        mutateDeleteFile({
            category: MyDocumentCardState.category,
            studentId: MyDocumentCardState.student_id
        });
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

    return (
        <>
            <SingleDocumentCard
                MyDocumentCardState={MyDocumentCardState}
                category={props.category}
                comments={MyDocumentCardState.comments}
                docName={props.docName}
                handleGeneralDocSubmitV2={handleGeneralDocSubmitV2}
                isDeletingFile={isDeletingFile}
                isUploadingFile={isUploadingFile}
                link={MyDocumentCardState.link}
                onDeleteFileWarningPopUp={onDeleteFileWarningPopUp}
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                openCommentWindow={openCommentWindow}
                setBaseDocsflagOffcanvas={setBaseDocsflagOffcanvas}
                setShowPreview={setShowPreview}
                st={status}
                time={props.time}
                user={user}
            />
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                onClose={closeWarningWindow}
                open={MyDocumentCardState.deleteFileWarningModel}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('Do you want to delete')} {props.docName}?
                    </DialogContentText>
                    <TextField
                        fullWidth
                        label={
                            <>
                                Please type <b>delete</b> to delete.
                            </>
                        }
                        margin="dense"
                        onChange={(e) => onChangeDeleteField(e)}
                        placeholder="delete"
                        required
                        type="text"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={
                            isDeletingFile ||
                            MyDocumentCardState.delete_field !== 'delete'
                        }
                        onClick={(e) => onDeleteFilefromstudentV2(e)}
                        sx={{ mr: 1 }}
                        variant="contained"
                    >
                        {isDeletingFile ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('Yes', { ns: 'common' })
                        )}
                    </Button>
                    <Button onClick={closeWarningWindow} variant="outlined">
                        {t('No', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                onClose={() => setRejectProfileFileModelOpen(false)}
                open={rejectProfileFileModelOpen}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please give a reason why the uploaded
                        {MyDocumentCardState.category} is invalied?
                    </DialogContentText>
                    <TextField
                        defaultValue={MyDocumentCardState.comments || ''}
                        fullWidth
                        id="rejectmessage"
                        onChange={(e) => handleRejectMessage(e, e.target.value)}
                        required
                        type="text"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={
                            MyDocumentCardState.comments === '' || isPending
                        }
                        onClick={onUpdateProfileFilefromstudent2}
                        variant="contained"
                    >
                        {isPending ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('Submit', { ns: 'common' })
                        )}
                    </Button>
                    <Button
                        onClick={() => setRejectProfileFileModelOpen(false)}
                    >
                        {t('No', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onClose={() => setAcceptProfileFileModelOpen(false)}
                open={acceptProfileFileModelOpen}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {MyDocumentCardState.category} is a valid and can be
                        used for the application?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={isPending}
                        onClick={onUpdateProfileFilefromstudent2}
                        variant="contained"
                    >
                        {isPending ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('Yes', { ns: 'common' })
                        )}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => setAcceptProfileFileModelOpen(false)}
                        variant="outlined"
                    >
                        {t('No', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                aria-labelledby="contained-modal-title-vcenter2"
                fullWidth={true}
                maxWidth="xl"
                onClose={() => setShowPreview(false)}
                open={showPreview}
            >
                <DialogTitle>{fileName}</DialogTitle>
                <FilePreview
                    apiFilePath={apiPath}
                    path={`${MyDocumentCardState.student_id}/${fileName}`}
                />
                <DialogContent>
                    {is_TaiGer_AdminAgent(user) ? (
                        <>
                            <Typography fontWeight="bold" variant="body1">
                                {base_documents_checklist[props.category] &&
                                base_documents_checklist[props.category]
                                    .length !== 0
                                    ? 'Check list: Please check the following points so that you can flag this document as valid.'
                                    : null}
                            </Typography>
                            {base_documents_checklist[props.category]
                                ? base_documents_checklist[props.category].map(
                                      (check_item, i) => (
                                          <FormControlLabel
                                              control={
                                                  <Checkbox
                                                      id={`${check_item}-${i}`}
                                                      onChange={(e) =>
                                                          onChecked(e)
                                                      }
                                                  />
                                              }
                                              key={i}
                                              label={`${check_item}`}
                                          />
                                      )
                                  )
                                : t('No', { ns: 'common' })}
                        </>
                    ) : null}
                    {fileName && fileName.split('.')[1] !== 'pdf' ? (
                        <a
                            download
                            href={`${BASE_URL}${apiPath}`}
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
                    {is_TaiGer_AdminAgent(user) ? (
                        <>
                            {status !== DocumentStatusType.Accepted ? (
                                <Button
                                    color="primary"
                                    disabled={
                                        !MyDocumentCardState.isLoaded ||
                                        MyDocumentCardState.num_points !==
                                            MyDocumentCardState.checkedBoxes
                                                .length
                                    }
                                    onClick={(e) =>
                                        onUpdateProfileDocStatus(
                                            e,
                                            props.category,
                                            MyDocumentCardState.student_id,
                                            DocumentStatusType.Accepted
                                        )
                                    }
                                    size="small"
                                    startIcon={<CheckIcon />}
                                    sx={{ mr: 2 }}
                                    title="Mark as finished"
                                    variant="contained"
                                >
                                    {t('Accept', { ns: 'common' })}
                                </Button>
                            ) : null}
                            <Button
                                color="secondary"
                                disabled={!MyDocumentCardState.isLoaded}
                                onClick={(e) =>
                                    onUpdateProfileDocStatus(
                                        e,
                                        props.category,
                                        MyDocumentCardState.student_id,
                                        DocumentStatusType.Rejected
                                    )
                                }
                                size="small"
                                startIcon={<CloseIcon />}
                                sx={{ mr: 2 }}
                                title="Mark as reject"
                                variant="contained"
                            >
                                {t('Reject', { ns: 'documents' })}
                            </Button>
                        </>
                    ) : null}
                    <Button
                        onClick={() => setShowPreview(false)}
                        size="small"
                        variant="outlined"
                    >
                        {!MyDocumentCardState.isLoaded ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('Close', { ns: 'common' })
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                onClose={() => setNeededWindowOpen(false)}
                open={neededWindowOpen}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to set {MyDocumentCardState.category} as
                        mandatory document?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isPending ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            disabled={isPending}
                            onClick={onUpdateProfileFilefromstudent2}
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
                aria-labelledby="contained-modal-title-vcenter"
                onClose={() => setMissingWindowOpen(false)}
                open={missingWindowOpen}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to set {MyDocumentCardState.category}{' '}
                        unnecessary document?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isPending ? <Loading /> : null}
                    <Button
                        disabled={isPending}
                        onClick={onUpdateProfileFilefromstudent2}
                        variant="contained"
                    >
                        {t('Yes', { ns: 'common' })}
                    </Button>
                    <Button onClick={() => setMissingWindowOpen(false)}>
                        {t('No', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
            <OffcanvasBaseDocument
                baseDocsflagOffcanvasButtonDisable={
                    baseDocsflagOffcanvasButtonDisable
                }
                docName={props.docName}
                link={MyDocumentCardState.link}
                onChangeURL={onChangeURL}
                onHide={() => setBaseDocsflagOffcanvas(false)}
                open={baseDocsflagOffcanvas}
                updateDocLink={updateDocLink}
            />
        </>
    );
};

export default MyDocumentCard;
