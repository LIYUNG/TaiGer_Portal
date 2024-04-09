import React, { useState } from 'react';
import { Alert, Button, Grid, Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import {
  file_category_const,
  is_TaiGer_role,
  is_program_closed,
  is_program_ml_rl_essay_finished
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';

function TaskDeltaInfoBox(props) {
  const { missingDocs, extraDocs } = props;
  return (
    <>
      <Grid item xs={12}>
        {missingDocs?.length > 0 && (
          <Alert severity="error">
            <Typography variant="string">
              Please assign the following missing document for this application:
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
        {extraDocs?.length > 0 && (
          <Alert severity="warning">
            <Typography variant="string">
              The following document is not required for this application:
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
  );
}

function TaskDeltaInfoBox(props) {
  const { missingDocs, extraDocs } = props;
  return (
    <>
      <Grid item xs={12}>
        {missingDocs?.length > 0 && (
          <Alert severity="error">
            <Typography variant="string">
              Please assign the following missing document for this application:
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
        {extraDocs?.length > 0 && (
          <Alert severity="warning">
            <Typography variant="string">
              The following document is not required for this application:
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
  );
}

function ManualFiles(props) {
  const { user } = useAuth();
  const [categoryState, setCategory] = useState('');
  const { missingDocs, extraDocs } = props;

  const handleCreateGeneralMessageThread = (e, studentId, fileCategory) => {
    e.preventDefault();
    if (!categoryState) {
      alert('Please select file type');
    } else {
      props.initGeneralFileThread(e, studentId, fileCategory);
      setCategory('');
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
  const required_doc_keys = Object.keys(file_category_const);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={10}>
        <Grid container spacing={2}>
          {(missingDocs || extraDocs) && (
            <TaskDeltaInfoBox missingDocs={missingDocs} extraDocs={extraDocs} />
          )}
          {props.filetype === 'ProgramSpecific' &&
            props.application?.decided !== 'O' && (
              <Grid item xs={12}>
                <Typography variant="string" sx={{ my: 2 }}>
                  <b>
                    This following tasks are not visible in tasks dashboard and
                    CV/ML/RL/Center. Please
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

          {is_TaiGer_role(user) &&
            (!props.application ||
              (props.application && props.application.closed !== 'O')) && (
              <Grid item xs={12}>
                <ToggleableUploadFileForm
                  role={user.role}
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
              </Grid>
            )}
        </Grid>
      </Grid>
      {props.filetype === 'ProgramSpecific' && (
        <Grid item xs={12} md={2}>
          {props.application?.decided === 'O' && (
            <Button
              fullWidth
              color="primary"
              disabled={!is_program_ml_rl_essay_finished(props.application)}
              variant={
                is_program_closed(props.application) ? 'outlined' : 'contained'
              }
              onClick={() =>
                props.handleProgramStatus(
                  props.student._id.toString(),
                  props.application.programId._id.toString()
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
        </Grid>
      )}
    </Grid>
  );
}

export default ManualFiles;
