import React, { useEffect, useState } from 'react';
import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';

import {
  is_new_message_status,
  is_pending_status,
  cvmlrl_overview_header,
  cvmlrl_overview_closed_header
} from '../Utils/contants';
import { is_TaiGer_role, open_tasks } from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { SetFileAsFinal } from '../../api';
import Banner from '../../components/Banner/Banner';
import SortTable from '../../components/SortTable/SortTable';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import ModalNew from '../../components/Modal';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function CVMLRLOverview(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [cVMLRLOverviewState, setCVMLRLOverviewState] = useState({
    error: '',
    isLoaded: props.isLoaded,
    data: null,
    success: props.success,
    students: props.students,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setCVMLRLOverviewState((prevState) => ({
      ...prevState,
      students: props.students
    }));
  }, [props.students]);

  const closeSetAsFinalFileModelWindow = () => {
    setCVMLRLOverviewState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };
  const ConfirmSetAsFinalFileHandler = () => {
    setCVMLRLOverviewState((prevState) => ({
      ...prevState,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      cVMLRLOverviewState.doc_thread_id,
      cVMLRLOverviewState.student_id,
      cVMLRLOverviewState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let temp_students = [...cVMLRLOverviewState.students];
          let student_temp_idx = temp_students.findIndex(
            (student) =>
              student._id.toString() === cVMLRLOverviewState.student_id
          );
          if (cVMLRLOverviewState.program_id) {
            let application_idx = temp_students[
              student_temp_idx
            ].applications.findIndex(
              (application) =>
                application.programId._id.toString() ===
                cVMLRLOverviewState.program_id
            );

            let thread_idx = temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                cVMLRLOverviewState.doc_thread_id
            );

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].isFinalVersion =
              data.isFinalVersion;

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].updatedAt = data.updatedAt;
            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].doc_thread_id.updatedAt =
              data.updatedAt;
          } else {
            let general_doc_idx = temp_students[
              student_temp_idx
            ].generaldocs_threads.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                cVMLRLOverviewState.doc_thread_id
            );
            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].isFinalVersion = data.isFinalVersion;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].updatedAt = data.updatedAt;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].doc_thread_id.updatedAt = data.updatedAt;
          }

          setCVMLRLOverviewState((prevState) => ({
            ...prevState,
            docName: '',
            isLoaded: true,
            students: temp_students,
            success: success,
            SetAsFinalFileModel: false,
            isFinalVersion: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setCVMLRLOverviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCVMLRLOverviewState((prevState) => ({
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
    docName,
    isFinalVersion
  ) => {
    setCVMLRLOverviewState((prevState) => ({
      ...prevState,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      SetAsFinalFileModel: true,
      isFinalVersion
    }));
  };

  const ConfirmError = () => {
    setCVMLRLOverviewState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_modal_status, res_modal_message, isLoaded } = cVMLRLOverviewState;

  if (!isLoaded && !cVMLRLOverviewState.students) {
    return <Loading />;
  }

  const open_tasks_arr = open_tasks(cVMLRLOverviewState.students);
  const cvmlrl_new_message_v2 = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_new_message_status(user, open_task) 
      // open_task.file_type !== "Essay"
  );
  const cvmlrl_followup_v2 = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_pending_status(user, open_task) &&
      open_task.latest_message_left_by_id !== '' 
      // open_task.file_type !== "Essay"
  );
  const cvmlrl_pending_progress_v2 = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_pending_status(user, open_task) &&
      open_task.latest_message_left_by_id === '' 
      // open_task.file_type !== "Essay"
  );
  const cvmlrl_closed_v2 = open_tasks_arr.filter(
    (open_task) => open_task.show && open_task.isFinalVersion
  );
  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Open" {...a11yProps(0)} />
          <Tab label="Closed" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Banner
          ReadOnlyMode={true}
          bg={'danger'}
          title={'warning'}
          path={'/'}
          text={'Please reply:'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={cvmlrl_new_message_v2}
          user={user}
          handleAsFinalFile={handleAsFinalFile}
        />
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'info'}
          path={'/'}
          text={'Follow up'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={cvmlrl_followup_v2}
          user={user}
          handleAsFinalFile={handleAsFinalFile}
        />
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={is_TaiGer_role(user) ? 'info' : 'warning'}
          path={'/'}
          text={
            is_TaiGer_role(user)
              ? 'Waiting inputs. No action needed'
              : 'Please provide input as soon as possible'
          }
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={cvmlrl_pending_progress_v2}
          user={user}
          handleAsFinalFile={handleAsFinalFile}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'success'}
          path={'/'}
          text={'These tasks are closed.'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_closed_header}
          data={cvmlrl_closed_v2}
          user={user}
          handleAsFinalFile={handleAsFinalFile}
        />
        <Typography variant="body2">
          {t(
            'Note: if the documents are not closed but locate here, it is becaue the applications are already submitted. The documents can safely closed eventually.'
          )}
        </Typography>
      </CustomTabPanel>
      <ModalNew
        open={cVMLRLOverviewState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Warning')}</Typography>
        <Typography>
          Do you want to set {cVMLRLOverviewState.docName} as{' '}
          {cVMLRLOverviewState.isFinalVersion ? 'open' : 'final'} for student?
        </Typography>
        <Typography>
          <Button
            color="primary"
            variant="contained"
            disabled={!isLoaded}
            onClick={ConfirmSetAsFinalFileHandler}
          >
            {isLoaded ? t('Yes') : <CircularProgress />}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={closeSetAsFinalFileModelWindow}
          >
            {t('No')}
          </Button>
        </Typography>
      </ModalNew>
    </>
  );
}

export default CVMLRLOverview;
