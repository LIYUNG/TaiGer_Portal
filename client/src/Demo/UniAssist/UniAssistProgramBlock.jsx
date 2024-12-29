import {
  Box,
  Button,
  FormControlLabel,
  Link,
  Typography,
  Checkbox,
  styled,
  CircularProgress,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { DocumentStatusType, is_TaiGer_AdminAgent } from '@taiger-common/core';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { green, grey } from '@mui/material/colors';
import { useState } from 'react';
import i18next from 'i18next';

import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { BASE_URL } from '../../api/request';
import {
  deleteVPDFileV2,
  SetAsNotNeededV2,
  SetUniAssistPaidV2,
  uploadVPDforstudentV2
} from '../../api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../api/client';
import { useSnackBar } from '../../contexts/use-snack-bar';

const IconStatus = ({ condition }) =>
  condition ? (
    <CheckCircleIcon size={18} style={{ color: green[500] }} />
  ) : (
    <HelpIcon size={18} style={{ color: grey[400] }} />
  );

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const ProgramName = ({ application }) => {
  return (
    <Typography variant="body1" sx={{ mr: 2 }}>
      <Link
        underline="hover"
        to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id.toString())}`}
        component={LinkDom}
      >
        {`${application.programId.school} ${application.programId.program_name} - ${application.programId.semester} - ${application.programId.degree} - ${application.programId.uni_assist}`}
      </Link>
    </Typography>
  );
};

const SetNeedButtons = ({ application, setAsNotNeededModelOpen }) => {
  const { user } = useAuth();

  const opensetAsNotNeededWindow = (e) => {
    e.preventDefault();
    setAsNotNeededModelOpen(true);
  };

  return (
    <span>
      {is_TaiGer_AdminAgent(user) &&
        application.uni_assist?.vpd_paid_confirmation_file_path === '' &&
        application.uni_assist?.vpd_file_path === '' &&
        !application.uni_assist?.isPaid &&
        application.uni_assist?.status !== DocumentStatusType.NotNeeded && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={(e) => opensetAsNotNeededWindow(e)}
          >
            {i18next.t('Set Not Needed', { ns: 'common' })}
          </Button>
        )}
      {application.uni_assist?.status === DocumentStatusType.NotNeeded &&
        is_TaiGer_AdminAgent(user) && (
          <Button
            size="small"
            color="success"
            variant="outlined"
            onClick={(e) => opensetAsNotNeededWindow(e)}
          >
            {i18next.t('Set needed')}
          </Button>
        )}
    </span>
  );
};

export const UniAssistProgramBlock = ({ application, student }) => {
  const { user } = useAuth();

  const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();
  const [deleteVPDFileWarningModelOpen, setDeleteVPDFileWarningModelOpen] =
    useState(false);
  const [notNeededModelOpen, setAsNotNeededModelOpen] = useState(false);
  const [applicationState, setApplicationState] = useState(application);
  const handleMutationError = (error) => {
    setSeverity('error');
    setMessage(error.message || 'An error occurred. Please try again.');
    setOpenSnackbar(true);
  };
  const { mutate: mutateCheck, isPending: isChecking } = useMutation({
    mutationFn: SetUniAssistPaidV2,
    onError: handleMutationError,
    onSuccess: ({ data }) => {
      setSeverity('success');
      setMessage('VPD status marked successfully!');
      setApplicationState(data);
      queryClient.invalidateQueries({ queryKey: ['uniassist'] });
      setOpenSnackbar(true);
      setAsNotNeededModelOpen(false);
    }
  });
  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: SetAsNotNeededV2,
    onError: handleMutationError,
    onSuccess: ({ data }) => {
      setSeverity('success');
      setMessage('VPD status updated successfully!');
      setApplicationState(data);
      queryClient.invalidateQueries({ queryKey: ['uniassist'] });
      setOpenSnackbar(true);
      setAsNotNeededModelOpen(false);
    }
  });
  const { mutate: mutateUpload, isPending: isUploading } = useMutation({
    mutationFn: uploadVPDforstudentV2,
    onError: handleMutationError,
    onSuccess: ({ data }) => {
      setSeverity('success');
      setMessage('File uploaded successfully!');
      setApplicationState(data);
      queryClient.invalidateQueries({ queryKey: ['uniassist'] });
      setOpenSnackbar(true);
      setDeleteVPDFileWarningModelOpen(false);
    }
  });
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteVPDFileV2,
    onError: handleMutationError,
    onSuccess: ({ data }) => {
      setSeverity('success');
      setMessage('File deleted successfully!');
      setApplicationState(data);
      queryClient.invalidateQueries({ queryKey: ['uniassist'] });
      setOpenSnackbar(true);
      setDeleteVPDFileWarningModelOpen(false);
    }
  });
  const [uniAssistProgramBlockState, setUniAssistProgramBlockState] = useState({
    fileType: ''
  });

  const onDeleteVPDFileWarningPopUp = (e, fileType) => {
    e.preventDefault();
    setUniAssistProgramBlockState((prevState) => ({
      ...prevState,
      fileType
    }));
    setDeleteVPDFileWarningModelOpen(true);
  };

  const handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    onSubmitVPDFileV2(e, e.target.files[0], student_id, program_id, 'VPD');
  };

  const handleSetAsNotNeededV2 = () => {
    mutateUpdate({
      studentId: student._id.toString(),
      program_id: application.programId._id.toString()
    });
  };

  const onSubmitVPDFileV2 = (e, NewFile, studentId, program_id, fileType) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    mutateUpload({ studentId, program_id, data: formData, fileType });
  };

  const handleUniAssistDocDeleteV2 = () => {
    mutateDelete({
      studentId: student._id.toString(),
      program_id: application.programId._id.toString(),
      fileType: uniAssistProgramBlockState.fileType
    });
  };

  const handleUniAssistVPDPaidConfirmationDocSubmit = (
    e,
    student_id,
    program_id
  ) => {
    e.preventDefault();
    onSubmitVPDFileV2(
      e,
      e.target.files[0],
      student_id,
      program_id,
      'VPDConfirmation'
    );
  };
  const onCheckHandlerV2 = (e, studentId, program_id, isPaid) => {
    e.preventDefault();
    mutateCheck({ studentId, program_id, isPaid });
  };

  return (
    <Box>
      {applicationState.programId.uni_assist?.includes('Yes-VPD') && (
        <>
          <Box sx={{ display: 'flex' }}>
            <ProgramName application={applicationState} />
            <SetNeedButtons
              application={applicationState}
              student={student}
              setAsNotNeededModelOpen={setAsNotNeededModelOpen}
            />
          </Box>
          {applicationState.uni_assist?.status ===
            DocumentStatusType.NotNeeded && (
            <Typography variant="string">
              {i18next.t('uni-assist-not-necessary', { ns: 'uniassist' })}
            </Typography>
          )}
          {applicationState.uni_assist?.status !==
            DocumentStatusType.NotNeeded && (
            <Box>
              {is_TaiGer_AdminAgent(user) && (
                <FormControlLabel
                  label={i18next.t(
                    `All document uploaded to Uni-Assist and paid, waiting for VPD`,
                    { ns: 'uniassist' }
                  )}
                  disabled={
                    !(
                      !applicationState.uni_assist ||
                      applicationState.uni_assist.status ===
                        DocumentStatusType.Missing ||
                      applicationState.uni_assist.status === 'notstarted'
                    )
                  }
                  control={
                    <Checkbox
                      checked={applicationState.uni_assist.isPaid}
                      disabled={isChecking}
                      onChange={(e) =>
                        onCheckHandlerV2(
                          e,
                          student._id.toString(),
                          applicationState.programId._id.toString(),
                          !applicationState.uni_assist.isPaid
                        )
                      }
                    />
                  }
                />
              )}
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconStatus
                  condition={
                    !(
                      !applicationState.uni_assist ||
                      applicationState.uni_assist.status ===
                        DocumentStatusType.Missing ||
                      applicationState.uni_assist.status === 'notstarted'
                    )
                  }
                />
                <Typography variant="body1">
                  &nbsp; VPD &nbsp;
                  {!applicationState.uni_assist ||
                  applicationState.uni_assist.status ===
                    DocumentStatusType.Missing ||
                  applicationState.uni_assist.status === 'notstarted' ? (
                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      disabled={isUploading}
                      startIcon={
                        isUploading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                    >
                      {i18next.t('Upload', { ns: 'common' })} VPD
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) =>
                          handleUniAssistDocSubmit(
                            e,
                            student._id.toString(),
                            applicationState.programId._id.toString()
                          )
                        }
                      />
                    </Button>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        href={`${BASE_URL}/api/students/${student._id.toString()}/vpd/${applicationState.programId._id.toString()}/VPD`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        title={i18next.t('Download', { ns: 'common' })}
                      >
                        {i18next.t('Download', { ns: 'common' })} VPD
                      </Button>
                      <Button
                        onClick={(e) => onDeleteVPDFileWarningPopUp(e, 'VPD')}
                        disabled={isDeleting}
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                      >
                        {i18next.t('Delete', { ns: 'common' })} VPD
                      </Button>
                    </>
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconStatus
                  condition={
                    !(
                      !applicationState.uni_assist
                        ?.vpd_paid_confirmation_file_path ||
                      applicationState.uni_assist
                        ?.vpd_paid_confirmation_file_path === ''
                    )
                  }
                />
                <Typography>
                  &nbsp;Confirmation Form (if applicable)&nbsp;
                  {!applicationState.uni_assist
                    ?.vpd_paid_confirmation_file_path ||
                  applicationState.uni_assist
                    ?.vpd_paid_confirmation_file_path === '' ? (
                    <>
                      {isUploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Button
                          component="label"
                          size="small"
                          color="secondary"
                          disabled={
                            !(
                              !applicationState.uni_assist ||
                              applicationState.uni_assist.status ===
                                DocumentStatusType.Missing ||
                              applicationState.uni_assist.status ===
                                'notstarted'
                            )
                          }
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                        >
                          {i18next.t('Upload file', { ns: 'common' })}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(e) =>
                              handleUniAssistVPDPaidConfirmationDocSubmit(
                                e,
                                student._id.toString(),
                                applicationState.programId._id.toString()
                              )
                            }
                          />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        href={`${BASE_URL}/api/students/${student._id.toString()}/vpd/${applicationState.programId._id.toString()}/VPDConfirmation`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<DownloadIcon />}
                        title={i18next.t('Download', { ns: 'common' })}
                      >
                        {i18next.t('Download', { ns: 'common' })}
                      </Button>
                      <Button
                        color="error"
                        onClick={(e) =>
                          onDeleteVPDFileWarningPopUp(e, 'VPDConfirmation')
                        }
                        disabled={isDeleting}
                        variant="contained"
                        size="small"
                        startIcon={<DeleteIcon />}
                      >
                        {i18next.t('Delete', { ns: 'common' })}
                      </Button>
                    </>
                  )}
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      )}
      {applicationState.programId.uni_assist?.includes('Yes-FULL') && (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <ProgramName application={applicationState} />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              {i18next.t('uni-assist full', { ns: 'uniassist' })}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Dialog
        open={deleteVPDFileWarningModelOpen}
        onClose={() => setDeleteVPDFileWarningModelOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{i18next.t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {i18next.t('Do you want to delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            disabled={isDeleting}
            onClick={() => handleUniAssistDocDeleteV2()}
            startIcon={isDeleting && <CircularProgress size={20} />}
          >
            {isDeleting
              ? i18next.t('Deleting', { ns: 'common' })
              : i18next.t('Yes', { ns: 'common' })}
          </Button>
          <Button
            onClick={() => setDeleteVPDFileWarningModelOpen(false)}
            variant="outlined"
          >
            {i18next.t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={notNeededModelOpen}
        onClose={() => setAsNotNeededModelOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{i18next.t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {i18next.t(
              'Is VPD not necessary for this program (because other programs have already VPD and it can be reused for this)?'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={isUpdating}
            onClick={handleSetAsNotNeededV2}
            startIcon={isUpdating && <CircularProgress size={20} />}
          >
            {isUpdating
              ? i18next.t('Updating', { ns: 'common' })
              : i18next.t('Yes', { ns: 'common' })}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setAsNotNeededModelOpen(false)}
          >
            {i18next.t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
