import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getAllCVMLRLOverview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { Redirect } from 'react-router-dom';
import DEMO from '../../store/constant';
import { TopBar } from '../../components/TopBar/TopBar';

function EssayDashboard(props) {
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

  if (!is_TaiGer_role(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_status, isLoaded } = essayDashboardState;
  TabTitle('CV ML RL Center');
  if (!isLoaded && !essayDashboardState.students) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <Aux>
      <TopBar>Essay Dashboard</TopBar>
        <Card>Coming soon</Card>
    </Aux>
  );
}

export default EssayDashboard;
