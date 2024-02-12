import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Link,
  Typography
} from '@mui/material';

import CVMLRLOverview from '../CVMLRLCenter/CVMLRLOverview';
import ErrorPage from '../Utils/ErrorPage';
import { getEditor } from '../../api';
import {
  frequencyDistribution,
  is_TaiGer_role,
  open_tasks_with_editors
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import TasksDistributionBarChart from '../../components/Charts/TasksDistributionBarChart';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function EditorPage() {
  const { user_id } = useParams();
  const { user } = useAuth();
  const [editorPageState, setEditorPageState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    editor: null,
    students: null,
    res_status: 0
  });
  useEffect(() => {
    getEditor(user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setEditorPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            editor: data.editor,
            students: data.students,
            success: success,
            res_status: status
          }));
        } else {
          setEditorPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setEditorPageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [user_id]);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_status, isLoaded } = editorPageState;

  if (!isLoaded && !editorPageState.editor && !editorPageState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  TabTitle(
    `Editor: ${editorPageState.editor.firstname}, ${editorPageState.editor.lastname}`
  );

  const open_tasks_arr = open_tasks_with_editors(editorPageState.students);
  const task_distribution = open_tasks_arr
    .filter(({ isFinalVersion }) => isFinalVersion !== true)
    .map(({ deadline, file_type, show, isPotentials }) => {
      return { deadline, file_type, show, isPotentials };
    });
  const open_distr = frequencyDistribution(task_distribution);

  const sort_date = Object.keys(open_distr).sort();

  const sorted_date_freq_pair = [];
  sort_date.forEach((date) => {
    sorted_date_freq_pair.push({
      name: `${date}`,
      active: open_distr[date].show,
      potentials: open_distr[date].potentials
    });
  });

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
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.TEAM_MEMBERS_LINK}`}
        >
          {appConfig.companyName} Team
        </Link>
        <Typography color="text.primary">
          {editorPageState.editor.firstname} {editorPageState.editor.lastname}
          {` (${editorPageState.students.length})`}
        </Typography>
      </Breadcrumbs>
      <Box>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">
            {editorPageState.editor.firstname} {editorPageState.editor.lastname}{' '}
            Open Tasks Distribution
          </Typography>
          <Typography>
            Tasks distribute among the date. Note that CVs, MLs, RLs, and Essay
            are mixed together.
          </Typography>
          <Typography>
            <b style={{ color: 'red' }}>active:</b> students decide programs.
            These will be shown in{' '}
            <LinkDom to={`${DEMO.CV_ML_RL_DASHBOARD_LINK}`}>
              Tasks Dashboard
            </LinkDom>
          </Typography>
          <Typography>
            <b style={{ color: '#A9A9A9' }}>potentials:</b> students do not
            decide programs yet. But the tasks will be potentially active when
            they decided.
          </Typography>
          <TasksDistributionBarChart data={sorted_date_freq_pair} />
        </Card>
      </Box>
      <CVMLRLOverview
        isLoaded={editorPageState.isLoaded}
        user={editorPageState.editor}
        success={editorPageState.success}
        students={editorPageState.students}
      />
      <Box>
        <Link
          component={LinkDom}
          to={`${DEMO.TEAM_EDITOR_ARCHIV_LINK(
            editorPageState.editor._id.toString()
          )}`}
        >
          <Button color="primary" variant="contained">
            See Archiv Student
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default EditorPage;
