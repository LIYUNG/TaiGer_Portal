import React, { useState } from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  Collapse,
  CardContent,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Button,
  Link,
  LinearProgress,
  CircularProgress,
  linearProgressClasses,
  styled,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LaunchIcon from '@mui/icons-material/Launch';

import ApplicationProgressCardBody from './ApplicationProgressCardBody';
import { updateStudentApplicationResult } from '../../api';
import DEMO from '../../store/constant';
import {
  application_deadline_calculator,
  isProgramAdmitted,
  progressBarCounter
} from '../../Demo/Utils/checking-functions';
import { BASE_URL } from '../../api/request';
import {
  FILE_NOT_OK_SYMBOL,
  FILE_OK_SYMBOL,
  convertDate
} from '../../Demo/Utils/contants';
import { appConfig } from '../../config';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));

export default function ApplicationProgressCard(props) {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [application, setApplication] = useState(props.application);
  const [resultState, setResultState] = useState('-');
  // const [hasFile, setHasFile] = useState(false);
  const [letter, setLetter] = useState(null);
  const [returnedMessage, setReturnedMessage] = useState('');
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [showSetResultModal, setShowSetResultModal] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const openUndoModal = (e) => {
    e.stopPropagation();
    setShowUndoModal(true);
  };

  const closeUndoModal = () => {
    setShowUndoModal(false);
  };

  const openSetResultModal = (e, result) => {
    e.stopPropagation();
    setShowSetResultModal(true);
    setResultState(result);
  };

  const closeSetResultModal = () => {
    setShowSetResultModal(false);
  };
  const onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files) {
      setLetter(null);
      // setHasFile(false);
      return;
    }
    const file_num = e.target.files.length;
    if (file_num >= 1) {
      setLetter(e.target.files[0]);
      // setHasFile(true);
    } else {
      setLetter(null);
      // setHasFile(false);
    }
  };

  const handleUpdateResult = (e, result) => {
    e.stopPropagation();
    setIsLoading(true);
    setReturnedMessage('');
    const formData = new FormData();
    if (letter) {
      formData.append('file', letter);
    }
    updateStudentApplicationResult(
      props.student._id.toString(),
      application.programId._id.toString(),
      result,
      formData
    ).then(
      (res) => {
        const { success, data } = res.data;
        if (success) {
          const application_tmep = { ...application };
          application_tmep.admission = result;
          application_tmep.admission_letter = data.admission_letter;
          setApplication(application_tmep);
          setLetter(null);
          setShowUndoModal(false);
          setShowSetResultModal(false);
          setIsLoading(false);
        } else {
          const { message } = res.data;
          setLetter(null);
          setReturnedMessage(message);
          setIsLoading(false);
        }
      },
      () => {
        setLetter(null);
        setIsLoading(false);
      }
    );
  };
  return (
    <>
      <Card>
        <CardContent onClick={handleToggle}>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            {application_deadline_calculator(props.student, application) ===
            'CLOSE' ? (
              <>
                {application.admission === '-' && (
                  <>
                    <IconButton>{FILE_OK_SYMBOL}</IconButton>
                    &nbsp;
                    {t('Submitted', { ns: 'common' })}
                  </>
                )}
                {isProgramAdmitted(application) && (
                  <>
                    <IconButton>{FILE_OK_SYMBOL}</IconButton>
                    &nbsp;
                    {t('Admitted', { ns: 'common' })}
                  </>
                )}
                {application.admission === 'X' && (
                  <>
                    <IconButton>{FILE_NOT_OK_SYMBOL}</IconButton>
                    &nbsp;
                    {t('Rejected', { ns: 'common' })}
                  </>
                )}
              </>
            ) : application_deadline_calculator(props.student, application) ===
              'WITHDRAW' ? (
              <>
                <IconButton title="Withdraw">
                  <BlockIcon fontSize="small" />
                </IconButton>
                {application_deadline_calculator(props.student, application)}
              </>
            ) : (
              <>
                <IconButton title="Pending">
                  <HourglassEmptyIcon fontSize="small" />
                </IconButton>
                {application_deadline_calculator(props.student, application)}
              </>
            )}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <img
              src={`/assets/logo/country_logo/svg/${application?.programId.country}.svg`}
              alt="Logo"
              style={{ maxWidth: '24px', maxHeight: '24px' }}
            />{' '}
            &nbsp;
            <Link
              underline="hover"
              to={`${DEMO.SINGLE_PROGRAM_LINK(
                application?.programId?._id?.toString()
              )}`}
              component={LinkDom}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="body1" fontWeight="bold">
                {application?.programId?.school}
                <IconButton>
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Typography>
            </Link>
          </Box>
          <Typography variant="body2" fontWeight="bold">
            {application?.programId?.degree}{' '}
            {application?.programId?.program_name}{' '}
            {application?.programId?.semester}{' '}
          </Typography>
          <Typography variant="body2">
            {(application.admission === 'O' || application.admission === 'X') &&
              application.admission_letter?.status === 'uploaded' && (
                <a
                  href={`${BASE_URL}/api/admissions/${application.admission_letter?.admission_file_path.replace(
                    /\\/g,
                    '/'
                  )}`}
                  target="_blank"
                  className="text-info"
                  rel="noreferrer"
                >
                  {application.admission === 'O'
                    ? t('Admission Letter', { ns: 'admissions' })
                    : t('Rejection Letter', { ns: 'admissions' })}
                </a>
              )}
            {application_deadline_calculator(props.student, application) ===
              'CLOSE' &&
              application.admission !== '-' &&
              (!application.admission_letter?.status ||
                application.admission_letter?.status !== 'uploaded') && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  title="Undo"
                  onClick={(e) => openSetResultModal(e, application.admission)}
                  startIcon={<AddIcon />}
                  sx={{ my: 1 }}
                >
                  {application.admission === 'O'
                    ? t('Add Admission Letter', { ns: 'admissions' })
                    : t('Add Rejection Letter', { ns: 'admissions' })}
                </Button>
              )}
          </Typography>
          {appConfig.interviewEnable &&
            application_deadline_calculator(props.student, application) ===
              'CLOSE' &&
            application.admission === '-' && (
              <>
                {!application.interview_status && (
                  <>
                    <Typography variant="body2" sx={{ my: 1 }}>
                      {t(
                        'Have you received the interview invitation from this program?'
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 1 }}>
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`${DEMO.INTERVIEW_ADD_LINK}`)}
                      >
                        {t('Training Request', { ns: 'interviews' })}
                      </Button>
                    </Typography>
                  </>
                )}
                {application.interview_status === 'Unscheduled' && (
                  <>
                    <Typography variant="p" component="div" sx={{ my: 1 }}>
                      {t('Please arrange a meeting', { ns: 'interviews' })}
                    </Typography>
                    <Typography variant="p" component="div" sx={{ my: 1 }}>
                      <Typography variant="p" component="div" sx={{ my: 1 }}>
                        <Link
                          underline="hover"
                          to={`${DEMO.INTERVIEW_SINGLE_LINK(
                            application?.interview_id
                          )}`}
                          component={LinkDom}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Arrange a training
                        </Link>
                      </Typography>
                    </Typography>
                  </>
                )}
                {application.interview_status === 'Scheduled' && (
                  <>
                    <Typography variant="p" component="div" sx={{ my: 1 }}>
                      {t('Do not forget to attend the interview training')}
                    </Typography>
                    <Typography variant="p" component="div" sx={{ my: 1 }}>
                      <Link
                        underline="hover"
                        to={`${DEMO.INTERVIEW_SINGLE_LINK(
                          application?.interview_id
                        )}`}
                        component={LinkDom}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {convertDate(
                          application.interview_training_event?.start
                        )}
                      </Link>
                    </Typography>
                  </>
                )}
              </>
            )}
          {application_deadline_calculator(props.student, application) ===
            'CLOSE' &&
            (application.admission === '-' ? (
              <Typography>{t('Tell me about your result')} : </Typography>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                title="Undo"
                onClick={(e) => openUndoModal(e)}
                startIcon={<UndoIcon />}
                sx={{ my: 1 }}
              >
                {t('Change your result')}
              </Button>
            ))}
          {application_deadline_calculator(props.student, application) ===
            'CLOSE' &&
            application.admission === '-' && (
              <Box sx={{ my: 1 }}>
                <Button
                  sx={{ mr: 1 }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => openSetResultModal(e, 'O')}
                  startIcon={<CheckIcon />}
                >
                  {t('Admitted', { ns: 'common' })}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={(e) => openSetResultModal(e, 'X')}
                  startIcon={<CloseIcon />}
                >
                  {t('Rejected', { ns: 'common' })}
                </Button>
              </Box>
            )}
          <Typography
            variant="body1"
            component="div"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={
                application_deadline_calculator(props.student, application) ===
                'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, application)
              }
              style={{ flex: 1, marginRight: '10px' }}
              className="custom-progress-bar-container" // Apply your specific classhere
            />
            <span>
              {`${
                application_deadline_calculator(props.student, application) ===
                'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, application)
              }%`}
            </span>
          </Typography>
        </CardContent>
        <Collapse in={isCollapse}>
          <ApplicationProgressCardBody
            student={props.student}
            application={application}
          />
        </Collapse>
      </Card>
      <Dialog open={showUndoModal} onClose={closeUndoModal} size="small">
        <DialogTitle>{t('Attention')}</DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            {t('Do you want to reset the result of the application of')}{' '}
            <b>{`${application.programId.school}-${application.programId.degree}-${application.programId.program_name}`}</b>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            disabled={isLoading}
            title="Undo"
            sx={{ mr: 1 }}
            onClick={(e) => handleUpdateResult(e, '-')}
          >
            {isLoading ? (
              <CircularProgress size="small" />
            ) : (
              t('Confirm', { ns: 'common' })
            )}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            title="Undo"
            onClick={closeUndoModal}
          >
            {t('Cancel', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={showSetResultModal}
        onClose={closeSetResultModal}
      >
        <DialogTitle>{t('Attention')}</DialogTitle>
        <DialogContent>
          {application.admission === '-' && (
            <Typography id="modal-modal-description" sx={{ my: 2 }}>
              {t('Do you want to set the application of')}{' '}
              <b>{`${application.programId.school}-${application.programId.degree}-${application.programId.program_name}`}</b>{' '}
              <b>
                {resultState === 'O'
                  ? t('Admitted', { ns: 'common' })
                  : t('Rejected', { ns: 'common' })}
              </b>
              ?
            </Typography>
          )}
          <Typography sx={{ my: 2 }}>
            {resultState === 'O'
              ? t(
                  'Attach Admission Letter or Admission Email pdf or Email screenshot',
                  { ns: 'admissions' }
                )
              : t(
                  'Attach Rejection Letter or Admission Email pdf or Email screenshot',
                  { ns: 'admissions' }
                )}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="file"
            onChange={(e) => onFileChange(e)}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t(
              'Your agents and editors will receive your application result notification.',
              { ns: 'admissions' }
            )}
          </Typography>
          {returnedMessage !== '' && (
            <Typography style={{ color: 'red' }} sx={{ mb: 2 }}>
              {returnedMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color={resultState === 'O' ? 'primary' : 'secondary'}
            variant="contained"
            disabled={
              isLoading
              // || !hasFile
            }
            onClick={(e) => handleUpdateResult(e, resultState)}
            startIcon={isLoading ? <CircularProgress size={24} /> : null}
          >
            {resultState === 'O'
              ? t('Admitted', { ns: 'common' })
              : t('Rejected', { ns: 'common' })}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            title="Undo"
            sx={{ ml: 1 }}
            onClick={closeSetResultModal}
          >
            {t('Cancel', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
