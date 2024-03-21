import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';

import ErrorPage from '../Utils/ErrorPage';
import { getAllCVMLRLOverview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
  file_category_const,
  is_TaiGer_role,
  open_tasks
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import CVMLRLOverview from '../CVMLRLCenter/CVMLRLOverview';
import { is_new_message_status, is_pending_status } from '../Utils/contants';

function EssayOutsourcerPage() {
  const { user } = useAuth();
  const [essayOutsourcerPageState, setEssayOutsourcerPageState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
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

  useEffect(() => {
    getAllCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setEssayOutsourcerPageState({
            ...essayOutsourcerPageState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          });
        } else {
          setEssayOutsourcerPageState({
            ...essayOutsourcerPageState,
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setEssayOutsourcerPageState({
          ...essayOutsourcerPageState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_status, isLoaded } = essayOutsourcerPageState;
  TabTitle('Essay Center');
  if (!isLoaded && !essayOutsourcerPageState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const open_tasks_arr = open_tasks(essayOutsourcerPageState.students).filter(
    (open_task) =>
      [file_category_const.essay_required].includes(open_task.file_type) &&
      open_task.outsourced_user_id?.includes(user._id.toString())
  );

  const new_message_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_new_message_status(user, open_task)
  );

  const followup_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_pending_status(user, open_task) &&
      open_task.latest_message_left_by_id !== ''
  );

  const pending_progress_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      is_pending_status(user, open_task) &&
      open_task.latest_message_left_by_id === ''
  );

  const closed_tasks = open_tasks_arr.filter(
    (open_task) => open_task.show && open_task.isFinalVersion
  );

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">Essay Center</Typography>
      </Breadcrumbs>
      <CVMLRLOverview
        isLoaded={essayOutsourcerPageState.isLoaded}
        success={essayOutsourcerPageState.success}
        students={essayOutsourcerPageState.students}
        new_message_tasks={new_message_tasks}
        followup_tasks={followup_tasks}
        pending_progress_tasks={pending_progress_tasks}
        closed_tasks={closed_tasks}
      />
    </Box>
  );
}

export default EssayOutsourcerPage;
