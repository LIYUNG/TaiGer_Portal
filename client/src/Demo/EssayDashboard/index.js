import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
import EssayOverview from './EssayOverview';
import { is_new_message_status, is_pending_status } from '../Utils/contants';

function EssayDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [essayDashboardState, setEssayDashboardState] = useState({
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
          setEssayDashboardState({
            ...essayDashboardState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          });
        } else {
          setEssayDashboardState({
            ...essayDashboardState,
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setEssayDashboardState({
          ...essayDashboardState,
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
  const { res_status, isLoaded } = essayDashboardState;
  TabTitle('Essay Dashboard');
  if (!isLoaded && !essayDashboardState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const open_tasks_arr = open_tasks(essayDashboardState.students).filter(
    (open_task) =>
      [file_category_const.essay_required].includes(open_task.file_type)
  );

  const no_essay_writer_tasks = open_tasks_arr.filter(
    (open_task) =>
      open_task.show &&
      !open_task.isFinalVersion &&
      (open_task.outsourced_user_id === undefined ||
        open_task.outsourced_user_id.length === 0)
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

  const all_active_message_tasks = open_tasks_arr.filter(
    (open_task) => open_task.show
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
        <Typography color="text.primary">
          {t('Essay Dashboard', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <EssayOverview
        isLoaded={essayDashboardState.isLoaded}
        success={essayDashboardState.success}
        students={essayDashboardState.students}
        no_essay_writer_tasks={no_essay_writer_tasks}
        new_message_tasks={new_message_tasks}
        followup_tasks={followup_tasks}
        pending_progress_tasks={pending_progress_tasks}
        closed_tasks={closed_tasks}
        all_active_message_tasks={all_active_message_tasks}
      />
    </Box>
  );
}

export default EssayDashboard;
