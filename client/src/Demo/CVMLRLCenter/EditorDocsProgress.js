import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
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
import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { ImCheckmark } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

import ManualFiles from './ManualFiles';
import {
  is_program_ml_rl_essay_finished,
  is_program_closed,
  application_deadline_calculator,
  file_category_const
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

  const required_doc_keys = Object.keys(file_category_const);
  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
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
      <Divider />
      <Typography sx={{ mt: 2 }}>{t('Applications')}</Typography>
      {/* TODO: simplify this! with array + function! */}
      {editorDocsProgressState.student.applications &&
        editorDocsProgressState.student.applications.map((application, i) => (
          <div key={i}>
            <Accordion defaultExpanded={false} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={2}>
                  {application.decided === 'O' ? (
                    <>
                      {is_program_ml_rl_essay_finished(application) ? (
                        is_program_closed(application) ? (
                          <>
                            <Grid item xs={1} md={1}>
                              <ImCheckmark
                                size={24}
                                color="limegreen"
                                title="This program is closed"
                              />
                            </Grid>
                            <Grid item xs={1} md={1}>
                              <AiOutlineUndo
                                size={24}
                                color="red"
                                title="Re-open this program as it was not submitted"
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  handleProgramStatus(
                                    editorDocsProgressState.student._id.toString(),
                                    application.programId._id.toString()
                                  )
                                }
                              />
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item xs={1} md={1}>
                              <AiOutlineCheck
                                size={24}
                                color="white"
                                style={{ cursor: 'pointer' }}
                                title="Close this program - marked as finished."
                                onClick={() =>
                                  handleProgramStatus(
                                    editorDocsProgressState.student._id.toString(),
                                    application.programId._id.toString()
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={1} md={1}>
                              {
                                application.doc_modification_thread?.filter(
                                  (doc) => doc.isFinalVersion
                                ).length
                              }
                              /
                              {application.doc_modification_thread?.length || 0}
                            </Grid>
                          </>
                        )
                      ) : (
                        <>
                          <Grid item xs={1} md={1}></Grid>
                          <Grid item xs={1} md={1}>
                            {
                              application.doc_modification_thread?.filter(
                                (doc) => doc.isFinalVersion
                              ).length
                            }
                            /{application.doc_modification_thread?.length || 0}
                          </Grid>
                        </>
                      )}
                      <Grid item xs={4} md={4}>
                        <Link
                          to={`${DEMO.SINGLE_PROGRAM_LINK(
                            application.programId._id
                          )}`}
                          component={LinkDom}
                        >
                          <Typography
                            variant="body1"
                            color={
                              application.closed === 'O'
                                ? 'success.light'
                                : 'error.main'
                            }
                          >
                            <b>
                              {application.programId.school} -{' '}
                              {application.programId.degree} -{' '}
                              {application.programId.program_name}
                            </b>
                          </Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={2} md={2}>
                        {required_doc_keys.map(
                          (doc_reqired_key, i) =>
                            application.programId[doc_reqired_key] ===
                              'yes' && (
                              <Button
                                key={i}
                                size="small"
                                title={`${file_category_const[doc_reqired_key]}`}
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                  openRequirements_ModalWindow(
                                    application.programId[
                                      doc_reqired_key.replace(
                                        'required',
                                        'requirements'
                                      )
                                    ]
                                  )
                                }
                              >
                                {file_category_const[doc_reqired_key]}
                              </Button>
                            )
                        )}
                        {application.programId.rl_required > 0 && (
                          <Button
                            size="small"
                            title="RL"
                            variant="contained"
                            color="info"
                            onClick={() =>
                              openRequirements_ModalWindow(
                                application.programId.rl_requirements
                              )
                            }
                          >
                            RL
                          </Button>
                        )}
                      </Grid>
                      <Grid item sx={2} md={2}>
                        <Typography>
                          Deadline:{' '}
                          {application_deadline_calculator(
                            editorDocsProgressState.student,
                            application
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} md={1}>
                        <Typography>{t('Status')}: </Typography>
                      </Grid>
                      <Grid item xs={1} md={1}>
                        {application.closed === 'O' ? (
                          <Typography fontWeight="bold">
                            {t('Close')}
                          </Typography>
                        ) : (
                          <Typography fontWeight="bold">{t('Open')}</Typography>
                        )}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={2} md={2}></Grid>
                        <Grid item xs={4} md={4}>
                          <Link
                            to={`${DEMO.SINGLE_PROGRAM_LINK(
                              application.programId._id.toString()
                            )}`}
                            component={LinkDom}
                          >
                            <Typography variant="string" color="grey">
                              <b>
                                {application.programId.school} -{' '}
                                {application.programId.degree} -{' '}
                                {application.programId.program_name}
                              </b>
                            </Typography>
                          </Link>
                        </Grid>
                        <Grid item xs={2} md={2}>
                          {required_doc_keys.map(
                            (doc_reqired_key, i) =>
                              application.programId[doc_reqired_key] ===
                                'yes' && (
                                <Button
                                  key={i}
                                  size="sm"
                                  title={`${file_category_const[doc_reqired_key]}`}
                                  variant="secondary"
                                  onClick={() =>
                                    openRequirements_ModalWindow(
                                      application.programId[
                                        doc_reqired_key.replace(
                                          'required',
                                          'requirements'
                                        )
                                      ]
                                    )
                                  }
                                >
                                  {file_category_const[doc_reqired_key]}
                                </Button>
                              )
                          )}
                          {application.programId.rl_required > 0 && (
                            <Button
                              size="small"
                              title="Comments"
                              variant="info"
                              onClick={() =>
                                openRequirements_ModalWindow(
                                  application.programId.rl_requirements
                                )
                              }
                            >
                              RL
                            </Button>
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          <Typography>
                            {t('Deadline')}:{' '}
                            {application_deadline_calculator(
                              editorDocsProgressState.student,
                              application
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography>{t('Status')}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography>{t('Undecided')}</Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="string" sx={{ my: 2 }}>
                        <b>
                          Ths following tasks are not visible in tasks dashboard
                          and CV/ML/RL/Center. Please
                          {
                            <Link
                              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                                editorDocsProgressState.student._id.toString()
                              )}`}
                              component={LinkDom}
                            >
                              {' '}
                              click here
                            </Link>
                          }{' '}
                          to activate the application.
                        </b>
                      </Typography>
                    </>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {' '}
                <ManualFiles
                  onDeleteFileThread={onDeleteFileThread}
                  handleAsFinalFile={handleAsFinalFile}
                  student={editorDocsProgressState.student}
                  application={application}
                  filetype={'ProgramSpecific'}
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
        <Typography variant="h6">{t('Warning')}</Typography>
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
            t('Yes')
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
          {t('No')}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t('Warning')}
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
            t('Yes')
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
          {t('No')}
        </Button>
      </ModalNew>
      <ModalNew
        open={editorDocsProgressState.Requirements_Modal}
        onClose={close_Requirements_ModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">{t('Special Requirements')}</Typography>
        <Typography>{editorDocsProgressState.requirements}</Typography>
        <Button onClick={close_Requirements_ModalWindow}>{t('Close')}</Button>
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
          {t('Close')}
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
          {t('Yes')}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={closeSetProgramStatusModel}
        >
          {t('Close')}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default EditorDocsProgress;
