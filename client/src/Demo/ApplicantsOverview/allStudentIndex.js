import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { TopBar } from '../../components/TopBar/TopBar';

function AllApplicantsOverview(props) {
  const [allApplicantsOverviewState, setAllApplicantsOverviewState] = useState({
    error: '',
    isLoaded: false,
    success: false,
    students: null,
    status: '', //reject, accept... etc
    res_status: 0
  });

  useEffect(() => {
    if (props.user.role !== 'Student') {
      getAllActiveStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            setAllApplicantsOverviewState((prevState) => ({
              ...prevState,
              isLoaded: true,
              students: data,
              success: success,
              res_status: status
            }));
          } else {
            setAllApplicantsOverviewState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setAllApplicantsOverviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }, []);

  if (!is_TaiGer_role(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  if (props.user.role === 'Student') {
    return (
      <Redirect
        to={`${DEMO.STUDENT_APPLICATIONS_LINK}/${props.user._id.toString()}`}
      />
    );
  }
  TabTitle('Applications Overview');
  const { res_status, isLoaded } = allApplicantsOverviewState;

  if (!isLoaded && !allApplicantsOverviewState.students) {
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
      <TopBar>All Students Applications Overview</TopBar>
      <ApplicationOverviewTabs
        user={props.user}
        success={allApplicantsOverviewState.success}
        students={allApplicantsOverviewState.students}
      />
    </Aux>
  );
}

export default AllApplicantsOverview;
