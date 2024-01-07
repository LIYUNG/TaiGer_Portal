import React, { useEffect, useState } from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Aux from '../../../hoc/_Aux';
import {
  getLast180DaysObject,
  getLast180DaysSet,
  spinner_style,
  transformObjectToArray
} from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { is_TaiGer_Admin } from '../../Utils/checking-functions';

import { getUserLog } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import LogLineChart from '../../../components/Charts/LogLineChart';
import { appConfig } from '../../../config';
import { TopBar } from '../../../components/TopBar/TopBar';

function PortalSingleUserLog(props) {
  const { t, i18n } = useTranslation();
  const [PortalSingleUserLogState, setPortalSingleUserLogState] =
    useState({
      error: '',
      role: '',
      isLoaded: false,
      logs: null,
      success: false,
      range: 180,
      res_status: 0
    });

  useEffect(() => {
    getUserLog(props.match.params.user_id).then(
      (resp) => {
        const { data, success, user } = resp.data;
        const { status } = resp;
        if (success) {
          setPortalSingleUserLogState((prevState) => ({
            ...prevState,
            isLoaded: true,
            logs: data,
            user,
            success: success,
            res_status: status
          }));
        } else {
          setPortalSingleUserLogState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setPortalSingleUserLogState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [props.match.params.user_id]);

  if (!is_TaiGer_Admin(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} User Logs`);
  const { res_status, isLoaded } = PortalSingleUserLogState;

  if (!isLoaded) {
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

  const last180DaysObject = getLast180DaysObject();
  PortalSingleUserLogState.logs.forEach((log) => {
    last180DaysObject[log.date] += log.apiCallCount;
  });
  const dataToBeUsed = transformObjectToArray(last180DaysObject).sort((a, b) =>
    a.date > b.date ? 1 : -1
  );
  return (
    <Aux>
      <TopBar>
        {t('User')}&nbsp;
        <b>
          {PortalSingleUserLogState.user?.firstname}{' '}
          {PortalSingleUserLogState.user?.lastname}
        </b>{' '}
        Logs
      </TopBar>
      <Card>
        <Card.Body>
          <LogLineChart data={dataToBeUsed} />
          <br />
          <hh5>API calls detail:</hh5>
          <br />
          <br />
          {PortalSingleUserLogState.logs
            .sort((a, b) => (a.date > b.date ? -1 : 1))
            .map((log, idx) => (
              <li key={idx}>
                {log.user_id?.firstname} {log.user_id?.lastname} {log.date}
                {log.apiCallCount}
                {log.apiPath}
                {log.operation}
              </li>
            ))}
        </Card.Body>
      </Card>
    </Aux>
  );
}

export default PortalSingleUserLog;
