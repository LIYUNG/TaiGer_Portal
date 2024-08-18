import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  Button,
  CircularProgress,
  Link,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { green, grey } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BASE_URL } from '../../api/request';
import {
  is_TaiGer_AdminAgent,
  DocumentStatus,
  check_student_needs_uni_assist,
  isProgramDecided
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  uploadVPDforstudent,
  deleteVPDFile,
  SetAsNotNeeded,
  SetUniAssistPaid
} from '../../api';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

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

const IconStatus = ({ condition }) =>
  condition ? (
    <CheckCircleIcon size={18} style={{ color: green[500] }} />
  ) : (
    <HelpIcon size={18} style={{ color: grey[400] }} />
  );

function UniAssistListCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [uniAssistListCardState, setUniAssistListCardState] = useState({
    error: '',
    fileType: '',
    student_id: '',
    program_id: '',
    isLoaded2: {},
    isLoadedVPDConfirmation: {},
    isLoaded: false,
    student: props.student,
    deleteVPDFileWarningModel: false,
    setAsNotNeededModel: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    let temp_isLoaded = {};
    for (let i = 0; i < props.student.applications.length; i++) {
      temp_isLoaded[
        `${props.student.applications[i].programId._id.toString()}`
      ] = true;
    }
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      student: props.student,
      isLoaded2: temp_isLoaded,
      isLoadedVPDConfirmation: temp_isLoaded
    }));
  }, [props.student._id]);

  const closeWarningWindow = () => {
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      deleteVPDFileWarningModel: false
    }));
  };

  const handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    onSubmitVPDFile(e, e.target.files[0], student_id, program_id, 'VPD');
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

  const closesetAsNotNeededWindow = () => {
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      setAsNotNeededModel: false
    }));
  };

  const opensetAsNotNeededWindow = (e, student_id, program_id) => {
    e.preventDefault();
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      setAsNotNeededModel: true,
      student_id,
      program_id
    }));
  };

  const onCheckHandler = (e, student_id, program_id, isPaid) => {
    e.preventDefault();
    SetUniAssistPaid(student_id, program_id, isPaid).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistListCardState((prevState) => ({
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
          setUniAssistListCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistListCardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleSetAsNotNeeded = (e) => {
    e.preventDefault();
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      isLoaded2: {
        ...uniAssistListCardState.isLoaded2,
        [uniAssistListCardState.program_id]: false
      }
    }));

    SetAsNotNeeded(
      uniAssistListCardState.student_id,
      uniAssistListCardState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistListCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: data,
            success: success,
            setAsNotNeededModel: false,
            isLoaded2: {
              ...uniAssistListCardState.isLoaded2,
              [uniAssistListCardState.program_id]: true
            },
            student_id: '',
            program_id: '',
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setUniAssistListCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isLoaded2: {
              ...uniAssistListCardState.isLoaded2,
              [uniAssistListCardState.program_id]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistListCardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleUniAssistDocDelete = (e, program_id) => {
    if (uniAssistListCardState.fileType === 'VPD') {
      setUniAssistListCardState((prevState) => ({
        ...prevState,
        isLoaded2: {
          ...prevState.isLoaded2,
          [program_id]: false
        }
      }));
    }
    if (uniAssistListCardState.fileType === 'VPDConfirmation') {
      setUniAssistListCardState((prevState) => ({
        ...prevState,
        isLoadedVPDConfirmation: {
          ...prevState.isLoadedVPDConfirmation,
          [program_id]: false
        }
      }));
    }

    deleteVPDFile(
      uniAssistListCardState.student_id,
      uniAssistListCardState.program_id,
      uniAssistListCardState.fileType
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          const app = uniAssistListCardState.student.applications.find(
            (application) => application.programId._id.toString() === program_id
          );
          const app_idx = uniAssistListCardState.student.applications.findIndex(
            (application) => application.programId._id.toString() === program_id
          );
          if (uniAssistListCardState.fileType === 'VPD') {
            app.uni_assist.status = 'missing';
            app.uni_assist.vpd_file_path = '';
          }
          if (uniAssistListCardState.fileType === 'VPDConfirmation') {
            app.uni_assist.vpd_paid_confirmation_file_path = '';
          }
          app.uni_assist.updatedAt = new Date();
          let tmep_student = { ...uniAssistListCardState.student };
          tmep_student.applications[app_idx] = app;
          if (uniAssistListCardState.fileType === 'VPD') {
            setUniAssistListCardState((prevState) => ({
              ...prevState,
              isLoaded: true,
              isLoaded2: {
                ...prevState.isLoaded2,
                [program_id]: true
              },
              student: tmep_student,
              success: success,
              fileType: '',
              deleteVPDFileWarningModel: false,
              res_modal_status: status
            }));
          }
          if (uniAssistListCardState.fileType === 'VPDConfirmation') {
            setUniAssistListCardState((prevState) => ({
              ...prevState,
              isLoaded: true,
              isLoadedVPDConfirmation: {
                ...prevState.isLoadedVPDConfirmation,
                [program_id]: true
              },
              student: tmep_student,
              success: success,
              fileType: '',
              deleteVPDFileWarningModel: false,
              res_modal_status: status
            }));
          }
        } else {
          const { message } = resp.data;
          setUniAssistListCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isLoaded2: {
              ...prevState.isLoaded2,
              [program_id]: true
            },
            fileType: '',
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistListCardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          fileType: '',
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };
  const onDeleteVPDFileWarningPopUp = (e, student_id, program_id, fileType) => {
    e.preventDefault();
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      student_id,
      program_id,
      deleteVPDFileWarningModel: true,
      fileType
    }));
  };

  const onSubmitVPDFile = (e, NewFile, student_id, program_id, fileType) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    if (fileType === 'VPD') {
      setUniAssistListCardState((prevState) => ({
        ...prevState,
        isLoaded2: {
          ...prevState.isLoaded2,
          [program_id]: false
        }
      }));
    }
    if (fileType === 'VPDConfirmation') {
      setUniAssistListCardState((prevState) => ({
        ...prevState,
        isLoadedVPDConfirmation: {
          ...prevState.isLoadedVPDConfirmation,
          [program_id]: false
        }
      }));
    }

    uploadVPDforstudent(student_id, program_id, formData, fileType).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          if (fileType === 'VPD') {
            setUniAssistListCardState((prevState) => ({
              ...prevState,
              student: data, // resp.data = {success: true, data:{...}}
              success,
              category: '',
              isLoaded: true,
              isLoaded2: {
                ...prevState.isLoaded2,
                [program_id]: true
              },
              file: '',
              res_modal_status: status
            }));
          }
          if (fileType === 'VPDConfirmation') {
            setUniAssistListCardState((prevState) => ({
              ...prevState,
              student: data, // resp.data = {success: true, data:{...}}
              success,
              category: '',
              isLoaded: true,
              isLoadedVPDConfirmation: {
                ...prevState.isLoadedVPDConfirmation,
                [program_id]: true
              },
              file: '',
              res_modal_status: status
            }));
          }
        } else {
          const { message } = resp.data;
          setUniAssistListCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isLoaded2: {
              ...prevState.isLoaded2,
              [program_id]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setUniAssistListCardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmError = () => {
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const ProgramName = ({ application }) => {
    return (
      <Typography variant="body1" sx={{ mr: 2 }}>
        <Link
          underline="hover"
          to={`${DEMO.SINGLE_PROGRAM_LINK(
            application.programId._id.toString()
          )}`}
          component={LinkDom}
        >
          {`${application.programId.school} ${application.programId.program_name} - ${application.programId.semester} - ${application.programId.degree} - ${application.programId.uni_assist}`}
        </Link>
      </Typography>
    );
  };

  const SetNeedButtons = ({ application }) => {
    return (
      <span>
        {is_TaiGer_AdminAgent(user) &&
          application.uni_assist?.vpd_paid_confirmation_file_path === '' &&
          application.uni_assist?.vpd_file_path === '' &&
          !application.uni_assist?.isPaid &&
          application.uni_assist?.status !== DocumentStatus.NotNeeded && (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={(e) =>
                opensetAsNotNeededWindow(
                  e,
                  uniAssistListCardState.student._id.toString(),
                  application.programId._id.toString()
                )
              }
            >
              {t('Set Not Needed', { ns: 'common' })}
            </Button>
          )}
        {application.uni_assist?.status === DocumentStatus.NotNeeded &&
          is_TaiGer_AdminAgent(user) && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={(e) =>
                opensetAsNotNeededWindow(
                  e,
                  uniAssistListCardState.student._id.toString(),
                  application.programId._id.toString()
                )
              }
            >
              {t('Set needed')}
            </Button>
          )}
      </span>
    );
  };

  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    uniAssistListCardState;

  if (!isLoaded && !uniAssistListCardState.student) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const app_name = uniAssistListCardState.student.applications
    .filter((application) => isProgramDecided(application))
    .map((application, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        {application.programId.uni_assist?.includes('Yes-VPD') && (
          <>
            <Box sx={{ display: 'flex' }}>
              <ProgramName application={application} />
              <SetNeedButtons application={application} />
            </Box>
            {application.uni_assist?.status === DocumentStatus.NotNeeded && (
              <Typography variant="string">
                Uni-assist is not necessary as it can be reused from another
                program.
              </Typography>
            )}
            {application.uni_assist?.status !== DocumentStatus.NotNeeded && (
              <Box>
                {is_TaiGer_AdminAgent(user) && (
                  <FormControlLabel
                    label={t(
                      `All document uploaded to Uni-Assist and paid, waiting for VPD`,
                      { ns: 'uniassist' }
                    )}
                    disabled={
                      !(
                        !application.uni_assist ||
                        application.uni_assist.status ===
                          DocumentStatus.Missing ||
                        application.uni_assist.status === 'notstarted'
                      )
                    }
                    control={
                      <Checkbox
                        checked={application.uni_assist.isPaid}
                        onChange={(e) =>
                          onCheckHandler(
                            e,
                            uniAssistListCardState.student._id.toString(),
                            application.programId._id.toString(),
                            !application.uni_assist.isPaid
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
                        !application.uni_assist ||
                        application.uni_assist.status ===
                          DocumentStatus.Missing ||
                        application.uni_assist.status === 'notstarted'
                      )
                    }
                  />
                  <Typography variant="body1">
                    &nbsp; VPD &nbsp;
                    {!application.uni_assist ||
                    application.uni_assist.status === DocumentStatus.Missing ||
                    application.uni_assist.status === 'notstarted' ? (
                      <Button
                        component="label"
                        size="small"
                        variant="outlined"
                        disabled={
                          !uniAssistListCardState.isLoaded2[
                            application.programId._id.toString()
                          ]
                        }
                        startIcon={
                          !uniAssistListCardState.isLoaded2[
                            application.programId._id.toString()
                          ] ? (
                            <CircularProgress size={16} />
                          ) : (
                            <CloudUploadIcon />
                          )
                        }
                      >
                        {t('Upload', { ns: 'common' })} VPD
                        <VisuallyHiddenInput
                          type="file"
                          onChange={(e) =>
                            handleUniAssistDocSubmit(
                              e,
                              uniAssistListCardState.student._id.toString(),
                              application.programId._id.toString()
                            )
                          }
                        />
                      </Button>
                    ) : (
                      <>
                        <a
                          href={`${BASE_URL}/api/students/${uniAssistListCardState.student._id.toString()}/vpd/${application.programId._id.toString()}/VPD`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            title="Download"
                            disabled={
                              !uniAssistListCardState.isLoaded2[
                                application.programId._id.toString()
                              ]
                            }
                            variant="contained"
                            size="small"
                            startIcon={<DownloadIcon />}
                          >
                            {t('Download', { ns: 'common' })} VPD
                          </Button>
                        </a>
                        <Button
                          onClick={(e) =>
                            onDeleteVPDFileWarningPopUp(
                              e,
                              uniAssistListCardState.student._id.toString(),
                              application.programId._id.toString(),
                              'VPD'
                            )
                          }
                          disabled={
                            !uniAssistListCardState.isLoaded2[
                              application.programId._id.toString()
                            ]
                          }
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                        >
                          {t('Delete', { ns: 'common' })} VPD
                        </Button>
                      </>
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconStatus
                    condition={
                      !(
                        !application.uni_assist
                          ?.vpd_paid_confirmation_file_path ||
                        application.uni_assist
                          ?.vpd_paid_confirmation_file_path === ''
                      )
                    }
                  />
                  <Typography>
                    &nbsp;Confirmation Form (if applicable)&nbsp;
                    {!application.uni_assist?.vpd_paid_confirmation_file_path ||
                    application.uni_assist?.vpd_paid_confirmation_file_path ===
                      '' ? (
                      <>
                        {uniAssistListCardState.isLoadedVPDConfirmation[
                          `${application.programId._id.toString()}`
                        ] ? (
                          <>
                            <Button
                              component="label"
                              size="small"
                              color="secondary"
                              disabled={
                                !(
                                  !application.uni_assist ||
                                  application.uni_assist.status ===
                                    DocumentStatus.Missing ||
                                  application.uni_assist.status === 'notstarted'
                                )
                              }
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                            >
                              {t('Upload file', { ns: 'common' })}
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(e) =>
                                  handleUniAssistVPDPaidConfirmationDocSubmit(
                                    e,
                                    uniAssistListCardState.student._id.toString(),
                                    application.programId._id.toString()
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
                          href={`${BASE_URL}/api/students/${uniAssistListCardState.student._id.toString()}/vpd/${application.programId._id.toString()}/VPDConfirmation`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            title="Download"
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={
                              !uniAssistListCardState.isLoaded2[
                                application.programId._id.toString()
                              ]
                            }
                            startIcon={<DownloadIcon />}
                          >
                            {t('Download', { ns: 'common' })}
                          </Button>
                        </a>

                        <Button
                          color="error"
                          onClick={(e) =>
                            onDeleteVPDFileWarningPopUp(
                              e,
                              uniAssistListCardState.student._id.toString(),
                              application.programId._id.toString(),
                              'VPDConfirmation'
                            )
                          }
                          disabled={
                            !uniAssistListCardState.isLoadedVPDConfirmation[
                              application.programId._id.toString()
                            ]
                          }
                          variant="contained"
                          size="small"
                          startIcon={<DeleteIcon />}
                        >
                          {t('Delete', { ns: 'common' })}
                        </Button>
                      </>
                    )}
                  </Typography>
                </Stack>
              </Box>
            )}
          </>
        )}
        {application.programId.uni_assist?.includes('Yes-FULL') && (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <ProgramName application={application} />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                {t('uni-assist full', { ns: 'uniassist' })}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    ));
  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      {check_student_needs_uni_assist(uniAssistListCardState.student) ? (
        <Card sx={{ padding: 2 }}>
          <Typography>
            {t(
              'The following program needs uni-assist process, please check if paid, uploaded document and upload VPD here'
            )}
            :{app_name}
          </Typography>
        </Card>
      ) : (
        <Card sx={{ padding: 2 }}>
          <Typography>
            {t('Based on the applications, Uni-Assist is NOT needed')}
          </Typography>
        </Card>
      )}

      <Dialog
        open={uniAssistListCardState.deleteVPDFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('Do you want to delete?')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            disabled={
              !uniAssistListCardState.isLoaded2[
                uniAssistListCardState.program_id
              ] ||
              !uniAssistListCardState.isLoadedVPDConfirmation[
                uniAssistListCardState.program_id
              ]
            }
            onClick={(e) =>
              handleUniAssistDocDelete(e, uniAssistListCardState.program_id)
            }
          >
            {uniAssistListCardState.isLoaded2[
              uniAssistListCardState.program_id
            ] ||
            uniAssistListCardState.isLoadedVPDConfirmation[
              uniAssistListCardState.program_id
            ] ? (
              t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress size={16} />
            )}
          </Button>
          <Button onClick={closeWarningWindow} variant="outlined">
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={uniAssistListCardState.setAsNotNeededModel}
        onClose={closesetAsNotNeededWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Is VPD not necessary for this program (because other programs have already VPD and it can be reused for this)?'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            disabled={
              !uniAssistListCardState.isLoaded2[
                uniAssistListCardState.program_id
              ] ||
              !uniAssistListCardState.isLoadedVPDConfirmation[
                uniAssistListCardState.program_id
              ]
            }
            onClick={(e) => handleSetAsNotNeeded(e)}
          >
            {uniAssistListCardState.isLoaded2[
              uniAssistListCardState.program_id
            ] ||
            uniAssistListCardState.isLoadedVPDConfirmation[
              uniAssistListCardState.program_id
            ] ? (
              t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress size={16} />
            )}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={closesetAsNotNeededWindow}
          >
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default UniAssistListCard;
