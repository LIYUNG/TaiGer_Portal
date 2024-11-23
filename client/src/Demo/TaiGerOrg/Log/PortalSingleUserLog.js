import React, { useEffect, useState } from 'react';
import { Navigate, useParams, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_Admin } from '@taiger-common/core';

import {
  getLast180DaysObject,
  // getLast180DaysSet,
  transformObjectToArray
} from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { getUserLog } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import LogLineChart from '../../../components/Charts/LogLineChart';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';

function PortalSingleUserLog() {
  const { user_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [PortalSingleUserLogState, setPortalSingleUserLogState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    logs: null,
    success: false,
    range: 180,
    res_status: 0
  });

  useEffect(() => {
    getUserLog(user_id).then(
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
  }, [user_id]);

  if (!is_TaiGer_Admin(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} User Logs`);
  const { res_status, isLoaded } = PortalSingleUserLogState;

  if (!isLoaded) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const last180DaysObject = getLast180DaysObject();
  PortalSingleUserLogState.logs.forEach((log) => {
    last180DaysObject[log.date].TOTAL += log.apiCallCount;
    last180DaysObject[log.date][log.operation] += log.apiCallCount;
  });
  const dataToBeUsed = transformObjectToArray(last180DaysObject).sort((a, b) =>
    a.date > b.date ? 1 : -1
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
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.INTERNAL_LOGS_LINK}`}
        >
          {t('User Logs')}
        </Link>
        <Typography color="text.primary">
          {PortalSingleUserLogState.user?.firstname}{' '}
          {PortalSingleUserLogState.user?.lastname} Logs
        </Typography>
      </Breadcrumbs>
      <Card>
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
      </Card>
    </Box>
  );
}

export default PortalSingleUserLog;
