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
  // deleteVPDFile,
  deleteVPDFileV2,
  SetAsNotNeeded,
  SetUniAssistPaid,
  uploadVPDforstudent
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

const SetNeedButtons = ({ application }) => {
  const { user } = useAuth();

  // const opensetAsNotNeededWindow = (e, student_id, program_id) => {
  //   e.preventDefault();
  //   setUniAssistProgramBlockState((prevState) => ({
  //     ...prevState,
  //     setAsNotNeededModel: true,
  //     student_id,
  //     program_id
  //   }));
  // };

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
            // onClick={(e) =>
            //   opensetAsNotNeededWindow(
            //     e,
            //     uniAssistProgramBlockState.student._id.toString(),
            //     application.programId._id.toString()
            //   )
            // }
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
            // onClick={(e) =>
            //   opensetAsNotNeededWindow(
            //     e,
            //     uniAssistProgramBlockState.student._id.toString(),
            //     application.programId._id.toString()
            //   )
            // }
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
  const { mutate } = useMutation({
    mutationFn: deleteVPDFileV2,
    onError: (error) => {
      setSeverity('error');
      setMessage(error.message || 'An error occurred. Please try again.');
      setOpenSnackbar(true);
    },
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
    error: '',
    fileType: '',
    student_id: '',
    program_id: '',
    isLoaded2: {},
    isLoadedVPDConfirmation: {},
    isLoaded: false,
    student: student,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  const onDeleteVPDFileWarningPopUp = (e, student_id, program_id, fileType) => {
    e.preventDefault();
    setUniAssistProgramBlockState((prevState) => ({
      ...prevState,
      student_id,
      program_id,
      fileType
    }));
    setDeleteVPDFileWarningModelOpen(true);
  };

  const handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    onSubmitVPDFile(e, e.target.files[0], student_id, program_id, 'VPD');
  };

  const handleSetAsNotNeeded = (e) => {
    e.preventDefault();
    setUniAssistProgramBlockState((prevState) => ({
      ...prevState,
      isLoaded2: false
    }));

    SetAsNotNeeded(
      uniAssistProgramBlockState.student_id,
      uniAssistProgramBlockState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistProgramBlockState((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: data,
            success: success,
            isLoaded2: true,
            student_id: '',
            program_id: '',
            res_modal_status: status
          }));
          setAsNotNeededModelOpen(false);
        } else {
          const { message } = resp.data;
          setUniAssistProgramBlockState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistProgramBlockState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onSubmitVPDFile = (e, NewFile, student_id, program_id, fileType) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    if (fileType === 'VPD') {
      setUniAssistProgramBlockState((prevState) => ({
        ...prevState,
        isLoaded2: false
      }));
    }
    if (fileType === 'VPDConfirmation') {
      setUniAssistProgramBlockState((prevState) => ({
        ...prevState,
        isLoadedVPDConfirmation: false
      }));
    }

    uploadVPDforstudent(student_id, program_id, formData, fileType).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          if (fileType === 'VPD') {
            setApplicationState(data);
            setUniAssistProgramBlockState((prevState) => ({
              ...prevState,
              success,
              category: '',
              isLoaded: true,
              isLoaded2: true,
              file: '',
              res_modal_status: status
            }));
          }
          if (fileType === 'VPDConfirmation') {
            setApplicationState(data);
            setUniAssistProgramBlockState((prevState) => ({
              ...prevState,
              success,
              category: '',
              isLoaded: true,
              isLoadedVPDConfirmation: true,
              file: '',
              res_modal_status: status
            }));
          }
        } else {
          const { message } = resp.data;
          setUniAssistProgramBlockState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistProgramBlockState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleUniAssistDocDeleteV2 = () => {
    if (uniAssistProgramBlockState.fileType === 'VPD') {
      setUniAssistProgramBlockState((prevState) => ({
        ...prevState,
        isLoaded2: false
      }));
    }
    if (uniAssistProgramBlockState.fileType === 'VPDConfirmation') {
      setUniAssistProgramBlockState((prevState) => ({
        ...prevState,
        isLoadedVPDConfirmation: false
      }));
    }

    mutate({
      studentId: uniAssistProgramBlockState.student_id,
      program_id: uniAssistProgramBlockState.program_id,
      fileType: uniAssistProgramBlockState.fileType
    });
  };

  const handleUniAssistVPDPaidConfirmationDocSubmit = (
    e,
    student_id,
    program_id
  ) => {
    e.preventDefault();
    onSubmitVPDFile(
      e,
      e.target.files[0],
      student_id,
      program_id,
      'VPDConfirmation'
    );
  };

  const onCheckHandler = (e, student_id, program_id, isPaid) => {
    e.preventDefault();
    SetUniAssistPaid(student_id, program_id, isPaid).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistProgramBlockState((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: data,
            success: success,
            student_id: '',
            program_id: '',
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setUniAssistProgramBlockState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistProgramBlockState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  return (
    <Box>
      {applicationState.programId.uni_assist?.includes('Yes-VPD') && (
        <>
          <Box sx={{ display: 'flex' }}>
            <ProgramName application={applicationState} />
            <SetNeedButtons application={applicationState} />
          </Box>
          {applicationState.uni_assist?.status ===
            DocumentStatusType.NotNeeded && (
            <Typography variant="string">
              Uni-assist is not necessary as it can be reused from another
              program.
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
                      onChange={(e) =>
                        onCheckHandler(
                          e,
                          uniAssistProgramBlockState.student._id.toString(),
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
                      disabled={!uniAssistProgramBlockState.isLoaded2}
                      startIcon={
                        !uniAssistProgramBlockState.isLoaded2 ? (
                          <CircularProgress size={16} />
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
                            uniAssistProgramBlockState.student._id.toString(),
                            applicationState.programId._id.toString()
                          )
                        }
                      />
                    </Button>
                  ) : (
                    <>
                      <a
                        href={`${BASE_URL}/api/students/${uniAssistProgramBlockState.student._id.toString()}/vpd/${applicationState.programId._id.toString()}/VPD`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          title="Download"
                          disabled={!uniAssistProgramBlockState.isLoaded2}
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                        >
                          {i18next.t('Download', { ns: 'common' })} VPD
                        </Button>
                      </a>
                      <Button
                        onClick={(e) =>
                          onDeleteVPDFileWarningPopUp(
                            e,
                            uniAssistProgramBlockState.student._id.toString(),
                            applicationState.programId._id.toString(),
                            'VPD'
                          )
                        }
                        disabled={!uniAssistProgramBlockState.isLoaded2}
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
                      {uniAssistProgramBlockState.isLoadedVPDConfirmation ? (
                        <>
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
                                  uniAssistProgramBlockState.student._id.toString(),
                                  applicationState.programId._id.toString()
                                )
                              }
                            />
                          </Button>
                        </>
                      ) : (
                        <CircularProgress size={16} />
                      )}
                    </>
                  ) : (
                    <>
                      <a
                        href={`${BASE_URL}/api/students/${uniAssistProgramBlockState.student._id.toString()}/vpd/${applicationState.programId._id.toString()}/VPDConfirmation`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          title="Download"
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!uniAssistProgramBlockState.isLoaded2}
                          startIcon={<DownloadIcon />}
                        >
                          {i18next.t('Download', { ns: 'common' })}
                        </Button>
                      </a>

                      <Button
                        color="error"
                        onClick={(e) =>
                          onDeleteVPDFileWarningPopUp(
                            e,
                            uniAssistProgramBlockState.student._id.toString(),
                            applicationState.programId._id.toString(),
                            'VPDConfirmation'
                          )
                        }
                        disabled={
                          !uniAssistProgramBlockState.isLoadedVPDConfirmation
                        }
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
            disabled={
              !uniAssistProgramBlockState.isLoaded2 ||
              !uniAssistProgramBlockState.isLoadedVPDConfirmation
            }
            onClick={() => handleUniAssistDocDeleteV2()}
          >
            {uniAssistProgramBlockState.isLoaded2 ||
            uniAssistProgramBlockState.isLoadedVPDConfirmation ? (
              i18next.t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress size={16} />
            )}
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
            color="secondary"
            variant="contained"
            disabled={
              !uniAssistProgramBlockState.isLoaded2 ||
              !uniAssistProgramBlockState.isLoadedVPDConfirmation
            }
            onClick={(e) => handleSetAsNotNeeded(e)}
          >
            {uniAssistProgramBlockState.isLoaded2 ||
            uniAssistProgramBlockState.isLoadedVPDConfirmation ? (
              i18next.t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress size={16} />
            )}
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
