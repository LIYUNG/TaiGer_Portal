import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';

import { getStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

function ApplicantSOverview(props) {
  const { t, i18n } = useTranslation();
  const [applicationsOverviewState, setApplicationsOverview] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    status: '', //reject, accept... etc
    res_status: 0
  });

  useEffect(() => {
    if (props.user.role !== 'Student') {
      getStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            setApplicationsOverview((prevState) => ({
              ...prevState,
              isLoaded: true,
              students: data,
              success: success,
              res_status: status
            }));
          } else {
            setApplicationsOverview((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setApplicationsOverview((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }, []);

  if (
    props.user.role !== 'Admin' &&
    props.user.role !== 'Editor' &&
    props.user.role !== 'Agent' &&
    props.user.role !== 'Student'
  ) {
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
  const { res_status, isLoaded } = applicationsOverviewState;

  if (!isLoaded && !applicationsOverviewState.students) {
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
      <Row className="sticky-top">
        <Col>
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                {is_TaiGer_role(props.user)
                  ? `${t('All Application Overview')}`
                  : `${props.user.firstname} ${props.user.lastname} Applications Overview`}
              </Card.Title>
            </Card.Header>
          </Card>
        </Col>
      </Row>
      <ApplicationOverviewTabs
        user={props.user}
        success={applicationsOverviewState.success}
        students={applicationsOverviewState.students}
      />
    </Aux>
  );
}

export default ApplicantSOverview;
