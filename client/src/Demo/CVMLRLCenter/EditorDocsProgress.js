import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography,
  TextField,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ImCheckmark } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

import ManualFiles from './ManualFiles';
import {
  LinkableNewlineText,
  application_deadline_calculator,
  isProgramDecided,
  isProgramSubmitted,
  isProgramWithdraw,
  check_generaldocs,
  getMissingDocs,
  getExtraDocs
} from '../Utils/checking-functions';

import { spinner_style2 } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  deleteGenralFileThread,
  deleteProgramSpecificFileThread,
  SetFileAsFinal,
  ToggleProgramStatus,
  initGeneralMessageThread,
  initApplicationMessageThread
} from '../../api';
import DEMO from '../../store/constant';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { AiOutlineLink } from 'react-icons/ai';

function EditorDocsProgress(props) {
  const { t } = useTranslation();
  const [editorDocsProgressState, setEditorDocsProgressState] = useState({
    error: '',
    delete_field: '',
    student: props.student,
    deleteFileWarningModel: false,
    SetProgramStatusModel: false,
    SetAsFinalFileModel: false,
    Requirements_Modal: false,
    isFinal: false,
    studentId: '',
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    docName: '',
    isLoaded: false,
    requirements: '',
    file: '',
    isThreadExisted: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  useEffect(() => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      isLoaded: true,
      student: props.student
    }));
  }, [props.student._id]);

  const closeSetProgramStatusModel = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      SetProgramStatusModel: false
    }));
  };
  const closeSetAsFinalFileModelWindow = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };
  const openRequirements_ModalWindow = (ml_requirements) => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      Requirements_Modal: true,
      requirements: ml_requirements
    }));
  };
  const close_Requirements_ModalWindow = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      Requirements_Modal: false,
      requirements: ''
    }));
  };
  const closeDocExistedWindow = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      isThreadExisted: false
    }));
  };
  const closeWarningWindow = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
  };

  const ConfirmDeleteDiscussionThreadHandler = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      isLoaded: false //false to reload everything
    }));
    if (editorDocsProgressState.program_id == null) {
      deleteGenralFileThread(
        editorDocsProgressState.doc_thread_id,
        editorDocsProgressState.student_id
      ).then(
        (resp) => {
          const { success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...editorDocsProgressState.student };
            let general_docs_idx = student_temp.generaldocs_threads.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                editorDocsProgressState.doc_thread_id
            );
            if (general_docs_idx !== -1) {
              student_temp.generaldocs_threads.splice(general_docs_idx, 1);
            }

            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              student_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: student_temp,
              success: success,
              delete_field: '',
              deleteFileWarningModel: false,
              res_modal_status: status
            }));
          } else {
            const { message } = resp.data;
            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        },
        (error) => {
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            delete_field: '',
            error,
            res_modal_status: 500,
            res_modal_message: ''
          }));
        }
      );
    } else {
      deleteProgramSpecificFileThread(
        editorDocsProgressState.doc_thread_id,
        editorDocsProgressState.program_id,
        editorDocsProgressState.student_id
      ).then(
        (resp) => {
          const { success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...editorDocsProgressState.student };
            let application_idx = student_temp.applications.findIndex(
              (application) =>
                application.programId._id.toString() ===
                editorDocsProgressState.program_id
            );
            if (application_idx !== -1) {
              let doc_thread_idx = student_temp.applications[
                application_idx
              ].doc_modification_thread.findIndex(
                (thread) =>
                  thread.doc_thread_id._id.toString() ===
                  editorDocsProgressState.doc_thread_id
              );
              if (doc_thread_idx !== -1) {
                student_temp.applications[
                  application_idx
                ].doc_modification_thread.splice(doc_thread_idx, 1);
              }
            }
            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              student_id: '',
              program_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: student_temp,
              delete_field: '',
              success: success,
              deleteFileWarningModel: false,
              res_modal_status: status
            }));
          } else {
            const { message } = resp.data;
            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              isLoaded: true,
              delete_field: '',
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        },
        (error) => {
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            delete_field: '',
            res_modal_status: 500,
            res_modal_message: ''
          }));
        }
      );
    }
  };

  const ConfirmSetAsFinalFileHandler = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      editorDocsProgressState.doc_thread_id,
      editorDocsProgressState.student_id,
      editorDocsProgressState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let student_temp = { ...editorDocsProgressState.student };
          let targetThread;
          if (editorDocsProgressState.program_id) {
            let application_idx = student_temp.applications.findIndex(
              (application) =>
                application.programId._id.toString() ===
                editorDocsProgressState.program_id
            );

            let thread_idx = student_temp.applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                editorDocsProgressState.doc_thread_id
            );
            targetThread =
              student_temp.applications[application_idx]
                .doc_modification_thread[thread_idx];
          } else {
            let general_doc_idx = student_temp.generaldocs_threads.findIndex(
              (docs) =>
                docs.doc_thread_id._id.toString() ===
                editorDocsProgressState.doc_thread_id
            );
            targetThread = student_temp.generaldocs_threads[general_doc_idx];
          }
          targetThread.isFinalVersion = data.isFinalVersion;
          targetThread.updatedAt = data.updatedAt;
          targetThread.doc_thread_id.updatedAt = data.updatedAt;

          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            studentId: '',
            applicationId: '',
            docName: '',
            isLoaded: true,
            student: student_temp,
            success: success,
            SetAsFinalFileModel: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setEditorDocsProgressState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleProgramStatus = (student_id, program_id) => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      student_id,
      program_id,
      SetProgramStatusModel: true
    }));
  };

  const SubmitProgramStatusHandler = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      isLoaded: false // false to reload everything
    }));
    ToggleProgramStatus(
      editorDocsProgressState.student_id,
      editorDocsProgressState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            studentId: '',
            applicationId: '',
            isLoaded: true,
            student: data,
            success: success,
            SetProgramStatusModel: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setEditorDocsProgressState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleAsFinalFile = (
    doc_thread_id,
    student_id,
    program_id,
    isFinal,
    docName
  ) => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      isFinal,
      SetAsFinalFileModel: true
    }));
  };

  const onChangeDeleteField = (e) => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      delete_field: e.target.value
    }));
  };

  const onDeleteFileThread = (
    doc_thread_id,
    application,
    studentId,
    docName
  ) => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      doc_thread_id,
      program_id: application ? application.programId._id : null,
      student_id: studentId,
      docName,
      deleteFileWarningModel: true
    }));
  };

  const initProgramSpecificFileThread = (
    e,
    studentId,
    programId,
    document_catgory
  ) => {
    e.preventDefault();
    initApplicationMessageThread(studentId, programId, document_catgory)
      .then((resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let student_temp = { ...editorDocsProgressState.student };
          let application_idx = student_temp.applications.findIndex(
            (application) => application.programId._id.toString() === programId
          );
          student_temp.applications[
            application_idx
          ].doc_modification_thread.push(data);

          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            student: student_temp,
            success: success,
            file: '',
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      })
      .catch((error) => {
        setEditorDocsProgressState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      });
  };

  const initGeneralFileThread = (e, studentId, document_catgory) => {
    // eslint-disable-next-line no-constant-condition
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initGeneralMessageThread(studentId, document_catgory)
        .then((resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...editorDocsProgressState.student };
            student_temp.generaldocs_threads.push(data);
            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              isLoaded: true, //false to reload everything
              student: student_temp,
              success: success,
              file: '',
              res_modal_status: status
            }));
          } else {
            // TODO: handle frontend render if create duplicate thread
            const { message } = resp.data;
            setEditorDocsProgressState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        })
        .catch((error) => {
          setEditorDocsProgressState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: ''
          }));
        });
    }
  };

  const ConfirmError = () => {
    setEditorDocsProgressState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_modal_status, res_modal_message, res_status, isLoaded } =
    editorDocsProgressState;

  if (!isLoaded && !editorDocsProgressState.student) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  function ApplicationAccordionSummary({ application }) {
    return (
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={2}>
          <Grid item xs={1} md={1}>
            {application.decided === '-' ? (
              <Typography variant="body1" color="grey" sx={{ mr: 2 }}>
                Undecided
              </Typography>
            ) : application.decided === 'X' ? (
              <Typography variant="body1" color="grey" sx={{ mr: 2 }}>
                Not wanted
              </Typography>
            ) : isProgramSubmitted(application) ? (
              <>
                <ImCheckmark
                  size={16}
                  color="limegreen"
                  title="This program is closed"
                />
              </>
            ) : isProgramWithdraw(application) ? (
              <Typography fontWeight="bold">
                {t('WITHDRAW', { ns: 'common' })}
              </Typography>
            ) : (
              <Typography fontWeight="bold">
                {t('In progress', { ns: 'common' })}
              </Typography>
            )}
          </Grid>
          <Grid item xs={1} md={1}>
            <Typography
              variant="body1"
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'error.main'
                  : 'grey'
              }
              sx={{ mr: 2 }}
            >
              {
                application.doc_modification_thread?.filter(
                  (doc) => doc.isFinalVersion
                ).length
              }
              /{application.doc_modification_thread?.length || 0}
            </Typography>
          </Grid>
          <Grid item xs={8} md={8}>
            <Typography
              variant="body1"
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'error.main'
                  : 'grey'
              }
              sx={{ mr: 2 }}
            >
              <b>
                {application.programId.school} - {application.programId.degree}{' '}
                - {application.programId.program_name}
              </b>
            </Typography>
            <Link
              to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
              component={LinkDom}
              target="_blank"
            >
              <AiOutlineLink />
            </Link>
          </Grid>
          <Grid item xs={2} md={2}>
            <Typography>
              Deadline:{' '}
              {application_deadline_calculator(
                editorDocsProgressState.student,
                application
              )}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
    );
  }
  const create_generaldoc_reminder = check_generaldocs(
    editorDocsProgressState.student
  );

  const decidedApplication =
    editorDocsProgressState.student.applications?.filter((app) =>
      isProgramDecided(app)
    );
  const notDecidedApplication =
    editorDocsProgressState.student.applications?.filter(
      (app) => !isProgramDecided(app)
    );
  const applications = [...decidedApplication, ...notDecidedApplication];

  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Typography variant="h6">
        {t('General Documents', { ns: 'common' })} ({t('CV', { ns: 'common' })},{' '}
        {t('Recommendation Letters', { ns: 'common' })})
      </Typography>
      <Accordion defaultExpanded={false} disableGutters>
        <AccordionDetails>
          {create_generaldoc_reminder && (
            <Alert sx={{ mb: 2 }} severity="warning">
              <Typography>
                The following general documents are not started yet, please{' '}
                <b>create</b> the discussion thread below:{' '}
                {editorDocsProgressState.student.generaldocs_threads &&
                  editorDocsProgressState.student.generaldocs_threads.findIndex(
                    (thread) => thread.doc_thread_id.file_type === 'CV'
                  ) === -1 && (
                    <li>
                      <b>{t('CV')}</b>
                    </li>
                  )}
              </Typography>
            </Alert>
          )}
          <ManualFiles
            onDeleteFileThread={onDeleteFileThread}
            handleAsFinalFile={handleAsFinalFile}
            student={editorDocsProgressState.student}
            filetype={'General'}
            initGeneralFileThread={initGeneralFileThread}
            initProgramSpecificFileThread={initProgramSpecificFileThread}
            application={null}
          />
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ mt: 2 }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {t('Applications', { ns: 'common' })}
      </Typography>
      {applications.map((application, i) => (
        <div key={i}>
          <Accordion defaultExpanded={false} disableGutters>
            <ApplicationAccordionSummary application={application} />
            <AccordionDetails>
              <ManualFiles
                onDeleteFileThread={onDeleteFileThread}
                handleAsFinalFile={handleAsFinalFile}
                student={editorDocsProgressState.student}
                application={application}
                openRequirements_ModalWindow={openRequirements_ModalWindow}
                filetype={'ProgramSpecific'}
                missingDocs={getMissingDocs(application)}
                extraDocs={getExtraDocs(application)}
                handleProgramStatus={handleProgramStatus}
                initGeneralFileThread={initGeneralFileThread}
                initProgramSpecificFileThread={initProgramSpecificFileThread}
              />
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ my: 2 }} />
        </div>
      ))}
      <ModalNew
        open={editorDocsProgressState.deleteFileWarningModel}
        onClose={closeWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">{t('Warning', { ns: 'common' })}</Typography>
        <Typography sx={{ my: 2 }}>
          Do you want to delete <b>{editorDocsProgressState.docName}</b>?
        </Typography>
        <InputLabel>
          <Typography>
            Please enter{' '}
            <i>
              <b>delete</b>
            </i>{' '}
            in order to delete the user.
          </Typography>
        </InputLabel>
        <TextField
          fullWidth
          size="small"
          type="text"
          placeholder="delete"
          value={`${editorDocsProgressState.delete_field}`}
          onChange={(e) => onChangeDeleteField(e)}
          sx={{ mb: 2 }}
        />
        <Button
          size="small"
          color="primary"
          variant="contained"
          disabled={
            !isLoaded || editorDocsProgressState.delete_field !== 'delete'
          }
          onClick={ConfirmDeleteDiscussionThreadHandler}
          sx={{ mr: 1 }}
        >
          {isLoaded ? (
            t('Yes', { ns: 'common' })
          ) : (
            <div style={spinner_style2}>
              <CircularProgress />
            </div>
          )}
        </Button>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={closeWarningWindow}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t('Warning', { ns: 'common' })}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          Do you want to set {editorDocsProgressState.docName} as{' '}
          {editorDocsProgressState.isFinal ? 'final' : 'open'}?
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="small"
          disabled={!isLoaded}
          onClick={ConfirmSetAsFinalFileHandler}
        >
          {isLoaded ? (
            t('Yes', { ns: 'common' })
          ) : (
            <div style={spinner_style2}>
              <CircularProgress />
            </div>
          )}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={closeSetAsFinalFileModelWindow}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.Requirements_Modal}
        onClose={close_Requirements_ModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">
          {t('Special Requirements', { ns: 'common' })}
        </Typography>
        <Typography>
          <LinkableNewlineText text={editorDocsProgressState.requirements} />
        </Typography>
        <Button
          color="primary"
          variant="outlined"
          onClick={close_Requirements_ModalWindow}
        >
          {t('Close', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.isThreadExisted}
        onClose={closeDocExistedWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">{t('Attention')}</Typography>
        <Typography>
          {editorDocsProgressState.docName} is already existed
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          onClick={closeDocExistedWindow}
        >
          {t('Close', { ns: 'common' })}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.SetProgramStatusModel}
        onClose={closeSetProgramStatusModel}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">{t('Attention')}</Typography>
        <Typography>
          Do you want to {editorDocsProgressState.isFinal ? 'close' : 're-open'}{' '}
          this program for {editorDocsProgressState.student.firstname}?
        </Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={!isLoaded}
          onClick={SubmitProgramStatusHandler}
        >
          {t('Yes', { ns: 'common' })}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={closeSetProgramStatusModel}
        >
          {t('Close', { ns: 'common' })}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default EditorDocsProgress;
