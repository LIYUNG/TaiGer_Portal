import React, { useState } from 'react';
import { Alert, Button, Card, Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import {
  check_generaldocs,
  file_category_const,
  getMissingDocs,
  getExtraDocs,
  is_program_closed,
  is_program_ml_rl_essay_finished
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';

function ManualFiles(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [categoryState, setCategory] = useState('');

  const handleCreateGeneralMessageThread = (e, studentId, fileCategory) => {
    e.preventDefault();
    if (!categoryState) {
      alert('Please select file type');
    } else {
      props.initGeneralFileThread(e, studentId, fileCategory);
      setCategory({ category: '' });
    }
  };

  const handleCreateProgramSpecificMessageThread = (
    e,
    studentId,
    programId,
    fileCategory
  ) => {
    e.preventDefault();
    if (!categoryState) {
      alert('Please select file type');
    } else {
      props.initProgramSpecificFileThread(
        e,
        studentId,
        programId,
        fileCategory
      );
      setCategory('');
    }
  };

  const handleSelect = (e) => {
    e.preventDefault();
    setCategory(e.target.value);
  };

  let missingDocs = [];
  let extraDocs = [];
  if (!props.filetype !== 'General') {
    missingDocs = getMissingDocs(props.application);
    extraDocs = getExtraDocs(props.application);
  }

  const create_generaldoc_reminder = check_generaldocs(props.student);
  const required_doc_keys = Object.keys(file_category_const);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10}>
          <Grid container spacing={2}>
            {props.filetype === 'General' && (
              <Grid item xs={12}>
                <Typography>
                  {t('General Documents', { ns: 'common' })} (
                  {t('CV', { ns: 'common' })},{' '}
                  {t('Recommendation Letters', {
                    ns: 'common'
                  })}
                  )
                </Typography>
                {create_generaldoc_reminder && (
                  <Card sx={{ p: 2, mb: 2 }}>
                    <Typography>
                      The following general documents are not started yet,
                      please <b>create</b> the discussion thread below:{' '}
                      {props.student.generaldocs_threads &&
                        props.student.generaldocs_threads.findIndex(
                          (thread) => thread.doc_thread_id.file_type === 'CV'
                        ) === -1 && (
                          <li>
                            <b>{t('CV')}</b>
                          </li>
                        )}
                    </Typography>
                  </Card>
                )}
              </Grid>
            )}
            {props.filetype === 'ProgramSpecific' && (
              <>
                <Grid item xs={12}>
                  {missingDocs.length > 0 && (
                    <Alert severity="error">
                      <Typography variant="string">
                        Please assign the following missing document for this
                        application:
                      </Typography>

                      {missingDocs?.map((doc, i) => (
                        <li key={i}>
                          <b>{doc}</b>
                        </li>
                      ))}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {extraDocs.length > 0 && (
                    <Alert severity="warning">
                      <Typography variant="string">
                        The following document is not required for this
                        application:
                      </Typography>

                      {extraDocs?.map((doc, i) => (
                        <li key={i}>
                          <b>{doc}</b>
                        </li>
                      ))}
                    </Alert>
                  )}
                </Grid>
              </>
            )}
            {props.filetype === 'ProgramSpecific' &&
              props.application?.decided !== 'O' && (
                <Grid item xs={12}>
                  <Typography variant="string" sx={{ my: 2 }}>
                    <b>
                      This following tasks are not visible in tasks dashboard
                      and CV/ML/RL/Center. Please
                      {
                        <Link
                          to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                            props.student._id.toString()
                          )}`}
                          component={LinkDom}
                          target="_blank"
                        >
                          {' '}
                          click here
                        </Link>
                      }{' '}
                      to activate the application.
                    </b>
                  </Typography>
                </Grid>
              )}
            <Grid item xs={12}>
              <ManualFilesList
                student={props.student}
                onDeleteFileThread={props.onDeleteFileThread}
                handleAsFinalFile={props.handleAsFinalFile}
                application={props.application}
              />
            </Grid>
            <Grid item xs={12}>
              {is_TaiGer_role(user) &&
                (!props.application ||
                  (props.application && props.application.closed !== 'O')) && (
                  <ToggleableUploadFileForm
                    user={user}
                    student={props.student}
                    handleSelect={handleSelect}
                    handleCreateGeneralMessageThread={
                      handleCreateGeneralMessageThread
                    }
                    handleCreateProgramSpecificMessageThread={
                      handleCreateProgramSpecificMessageThread
                    }
                    category={categoryState}
                    filetype={props.filetype}
                    application={props.application}
                  />
                )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          {props.filetype === 'ProgramSpecific' && (
            <>
              {props.application?.decided === 'O' && (
                <Button
                  fullWidth
                  color="primary"
                  disabled={!is_program_ml_rl_essay_finished(props.application)}
                  variant={
                    is_program_closed(props.application)
                      ? 'outlined'
                      : 'contained'
                  }
                  onClick={() =>
                    props.handleProgramStatus(
                      props.student._id.toString(),
                      props.application.programId._id.toString(),
                      is_program_closed(props.application)
                    )
                  }
                >
                  {is_program_closed(props.application)
                    ? 'Reopen'
                    : 'Mark Submitted'}
                </Button>
              )}
              <Typography>Veiw requirements:</Typography>
              {required_doc_keys.map(
                (doc_reqired_key, i) =>
                  props.application.programId[doc_reqired_key] === 'yes' && (
                    <Button
                      key={i}
                      fullWidth
                      size="small"
                      title={`${file_category_const[doc_reqired_key]}`}
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        props.openRequirements_ModalWindow(
                          props.application.programId[
                            doc_reqired_key.replace('required', 'requirements')
                          ]
                        )
                      }
                    >
                      {file_category_const[doc_reqired_key]}
                    </Button>
                  )
              )}
              {props.application.programId.rl_required > 0 && (
                <Button
                  fullWidth
                  size="small"
                  title="RL"
                  variant="contained"
                  color="info"
                  onClick={() =>
                    props.openRequirements_ModalWindow(
                      props.application.programId.rl_requirements
                    )
                  }
                >
                  RL
                </Button>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default ManualFiles;
