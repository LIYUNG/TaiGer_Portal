import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Card,
  Button,
  Link,
  Typography
} from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { getExpense } from '../../api';
import {
  frequencyDistribution,
  is_TaiGer_role,
  programs_refactor
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { ExtendableTable } from '../../components/ExtendableTable/ExtendableTable';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function SingleBalanceSheetOverview() {
  const { taiger_user_id } = useParams();
  const { user } = useAuth();
  const [singleBalanceSheetOverviewState, setSingleBalanceSheetOverviewState] =
    useState({
      error: '',
      role: '',
      isLoaded: false,
      data: null,
      success: false,
      students: null,
      the_user: null,
      res_status: 0
    });

  useEffect(() => {
    getExpense(taiger_user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleBalanceSheetOverviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data.students,
            the_user: data.the_user,
            success: success,
            res_status: status
          }));
        } else {
          setSingleBalanceSheetOverviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setSingleBalanceSheetOverviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const { res_status, isLoaded } = singleBalanceSheetOverviewState;

  if (
    !isLoaded &&
    !singleBalanceSheetOverviewState.students &&
    !singleBalanceSheetOverviewState.the_user
  ) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  TabTitle(
    `${singleBalanceSheetOverviewState.the_user.role}: ${singleBalanceSheetOverviewState.the_user.firstname}, ${singleBalanceSheetOverviewState.the_user.lastname}`
  );

  const open_applications_arr = programs_refactor(
    singleBalanceSheetOverviewState.students
  );
  const applications_distribution = open_applications_arr
    .filter(({ isFinalVersion }) => isFinalVersion !== true)
    .map(({ deadline, file_type, show }) => {
      return { deadline, file_type, show };
    });
  const open_distr = frequencyDistribution(applications_distribution);

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
          to={`${DEMO.ACCOUNTING_LINK}`}
        >
          Accounting
        </Link>
        <Typography color="text.primary">
          {singleBalanceSheetOverviewState.the_user.firstname}{' '}
          {singleBalanceSheetOverviewState.the_user.lastname}
        </Typography>
      </Breadcrumbs>
      <Card>
        <Typography variant="h6">
          {singleBalanceSheetOverviewState.the_user.firstname}{' '}
          {singleBalanceSheetOverviewState.the_user.lastname} Salary Overview
        </Typography>
      </Card>
      <ExtendableTable data={singleBalanceSheetOverviewState.students} />

      <Link
        to={`${DEMO.TEAM_AGENT_ARCHIV_LINK(
          singleBalanceSheetOverviewState.the_user._id.toString()
        )}`}
      >
        <Button variant="contained">See Archiv Student</Button>
      </Link>
    </Box>
  );
}

export default SingleBalanceSheetOverview;
