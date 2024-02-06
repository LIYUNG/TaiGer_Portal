import React, { useState } from 'react';

import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import {
  check_generaldocs,
  file_category_const,
  isDocumentsMissingAssign,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import { Card, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

  const create_generaldoc_reminder = check_generaldocs(props.student);
  const required_doc_keys = Object.keys(file_category_const);

  return (
    <>
      <Grid container spacing={2}>
        {props.filetype === 'General' && (
          <Grid item xs={12}>
            <Typography>
              {t('General Documents')} ({t('CV')}, {t('Recommendation Letters')}
              )
            </Typography>
            {create_generaldoc_reminder && (
              <Card sx={{ p: 2, mb: 2 }}>
                <Typography>
                  The following general documents are not started yet, please{' '}
                  <b>create</b> the discussion thread below:{' '}
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
          <Grid item xs={12}>
            {isDocumentsMissingAssign(props.application) && (
              <Card>
                <Typography variant="string">
                  Please assign the following documents to the student for{' '}
                </Typography>
                <b>
                  {props.application.programId.school}{' '}
                  {props.application.programId.program_name}
                </b>
                :{' '}
                {required_doc_keys.map(
                  (doc_reqired_key, i) =>
                    props.application.programId[doc_reqired_key] === 'yes' &&
                    props.application.doc_modification_thread.findIndex(
                      (thread) =>
                        thread.doc_thread_id.file_type ===
                        file_category_const[doc_reqired_key]
                    ) === -1 && (
                      <li key={i}>
                        <b>{file_category_const[doc_reqired_key]}</b>
                      </li>
                    )
                )}
              </Card>
            )}
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
            )}
        </Grid>
      </Grid>
    </>
  );
}

export default ManualFiles;
