import React, { useEffect, useState } from 'react';
import { Link as LinkDom, Navigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import {
  getLast180DaysObject,
  // getLast180DaysSet,
  transformObjectToArray
} from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { is_TaiGer_Admin } from '../../Utils/checking-functions';

import { getUsersLog } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import LogLineChart from '../../../components/Charts/LogLineChart';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

function TaiGerPortalUsersLog() {
  const { user_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [portalUsersLog, setPortalUsers] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    range: 180,
    res_status: 0
  });
  useEffect(() => {
    getUsersLog(user_id).then(
      (resp) => {
        const { data, success, user: user_data } = resp.data;
        const { status } = resp;
        if (success) {
          setPortalUsers((prevState) => ({
            ...prevState,
            isLoaded: true,
            logs: data,
            user: user_data,
            success: success,
            res_status: status
          }));
        } else {
          setPortalUsers((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setPortalUsers((prevState) => ({
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
  const { res_status, isLoaded } = portalUsersLog;

  if (!isLoaded) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  // const last180DaysSet = getLast180DaysSet();
  const last180DaysObject = getLast180DaysObject();
  portalUsersLog.logs.forEach((log) => {
    last180DaysObject[log.date] += log.apiCallCount;
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
        <Typography color="text.primary">{t('User Logs')}</Typography>
      </Breadcrumbs>
      <Card sx={{ p: 2 }}>
        <LogLineChart data={dataToBeUsed} />
        <br />
        <Typography variant="body1">API calls detail:</Typography>
        <br />
        {portalUsersLog.logs.map((log, i) => (
          <Typography key={i}>
            <Link
              to={`${DEMO.INTERNAL_LOGS_USER_ID_LINK(
                log.user_id._id.toString()
              )}`}
              component={LinkDom}
            >
              {log.user_id?.firstname} {log.user_id?.lastname}
            </Link>{' '}
            {log.date}
            {log.apiCallCount}
            {log.apiPath}
            {log.operation}
          </Typography>
        ))}
      </Card>
    </Box>
  );
}

export default TaiGerPortalUsersLog;
