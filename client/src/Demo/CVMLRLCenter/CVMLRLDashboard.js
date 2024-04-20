import React, { useMemo, useState } from 'react';
import { Button, Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { c1 } from '../Utils/contants';
import {
  // open_tasks,
  open_tasks_with_editors
} from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { SetFileAsFinal } from '../../api';
import Banner from '../../components/Banner/Banner';
import ModalNew from '../../components/Modal';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import Loading from '../../components/Loading/Loading';
import { MuiDataGrid } from '../../components/MuiDataGrid';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function CVMLRLDashboard(props) {
  const { t } = useTranslation();
  const [cVMLRLDashboardState, setCVMLRLDashboardState] = useState({
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
  const closeSetAsFinalFileModelWindow = () => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };
  const ConfirmSetAsFinalFileHandler = () => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      cVMLRLDashboardState.doc_thread_id,
      cVMLRLDashboardState.student_id,
      cVMLRLDashboardState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let temp_students = [...cVMLRLDashboardState.students];
          let student_temp_idx = temp_students.findIndex(
            (student) =>
              student._id.toString() === cVMLRLDashboardState.student_id
          );
          if (cVMLRLDashboardState.program_id) {
            let application_idx = temp_students[
              student_temp_idx
            ].applications.findIndex(
              (application) =>
                application.programId._id.toString() ===
                cVMLRLDashboardState.program_id
            );

            let thread_idx = temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                cVMLRLDashboardState.doc_thread_id
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
                cVMLRLDashboardState.doc_thread_id
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

          setCVMLRLDashboardState((prevState) => ({
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
          setCVMLRLDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCVMLRLDashboardState((prevState) => ({
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
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_modal_status, res_modal_message, isLoaded } =
    cVMLRLDashboardState;

  if (!isLoaded && !cVMLRLDashboardState.students) {
    return <Loading />;
  }

  const open_tasks_arr = open_tasks_with_editors(cVMLRLDashboardState.students);
  // const open_tasks_arr2 = open_tasks(cVMLRLDashboardState.students);

  const cvmlrl_active_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      open_task.latest_message_left_by_id !== ''
  );
  const cvmlrl_idle_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      open_task.latest_message_left_by_id === ''
  );

  const cvmlrl_closed_v2 = open_tasks_arr.filter(
    (open_task) => open_task.show && open_task.isFinalVersion
  );

  const cvmlrl_all_v2 = open_tasks_arr.filter((open_task) => open_task.show);

  const memoizedColumns = useMemo(() => c1, [c1]);

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
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab
            label={`In Progress (${cvmlrl_active_tasks?.length || 0})`}
            {...a11yProps(0)}
          />
          <Tab
            label={`No Input (${cvmlrl_idle_tasks?.length || 0})`}
            {...a11yProps(1)}
          />
          <Tab
            label={`Closed (${cvmlrl_closed_v2?.length || 0})`}
            {...a11yProps(2)}
          />
          <Tab
            label={`All (${cvmlrl_all_v2?.length || 0})`}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'warning'}
          path={'/'}
          text={
            'Received students inputs and Active Tasks. Be aware of the deadline!'
          }
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid rows={cvmlrl_active_tasks} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={'info'}
          path={'/'}
          text={'No student inputs tasks. Agents should push students'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid rows={cvmlrl_idle_tasks} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'success'}
          path={'/'}
          text={'These tasks are closed'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <Typography sx={{ p: 2 }}>
          {t(
            'Note: if the documents are not closed but locate here, it is because the applications are already submitted. The documents can safely closed eventually.',
            { ns: 'cvmlrl' }
          )}
        </Typography>
        <MuiDataGrid rows={cvmlrl_closed_v2} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'info'}
          path={'/'}
          text={'All tasks'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid rows={cvmlrl_all_v2} columns={memoizedColumns} />
      </CustomTabPanel>
      <ModalNew
        open={cVMLRLDashboardState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">{t('Warning', { ns: 'common' })}</Typography>
        <Typography>
          Do you want to set {cVMLRLDashboardState.docName} as{' '}
          {cVMLRLDashboardState.isFinalVersion ? 'open' : 'final'} for student?
        </Typography>
        <Button
          variant="contained"
          disabled={!isLoaded}
          onClick={ConfirmSetAsFinalFileHandler}
        >
          {t('Yes', { ns: 'common' })}
        </Button>
        <Button onClick={closeSetAsFinalFileModelWindow}>No</Button>
        {!isLoaded && <Loading />}
      </ModalNew>
    </>
  );
}

export default CVMLRLDashboard;
