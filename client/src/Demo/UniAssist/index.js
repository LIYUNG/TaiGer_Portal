import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Link, Typography, Card } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { is_TaiGer_Student } from '@taiger-common/core';

import UniAssistListCard from './UniAssistListCard';
import ErrorPage from '../Utils/ErrorPage';
import { getStudentUniAssist } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { check_student_needs_uni_assist } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function UniAssistList() {
  const { user } = useAuth();
  const [uniAssistListState, setUniAssistListState] = useState({
    error: '',
    isLoaded: false,
    student: null,
    deleteVPDFileWarningModel: false,
    res_status: 0
  });
  const { t } = useTranslation();
  useEffect(() => {
    getStudentUniAssist(user._id.toString()).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistListState({
            ...uniAssistListState,
            isLoaded: true,
            student: data,
            success: success,
            res_status: status
          });
        } else {
          setUniAssistListState({
            ...uniAssistListState,
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setUniAssistListState({
          ...uniAssistListState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  }, []);

  if (!is_TaiGer_Student(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Uni-Assist & VPD');
  const { res_status, isLoaded } = uniAssistListState;

  if (!isLoaded && !uniAssistListState.student) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">Uni-Assist Tasks & VPD</Typography>
      </Breadcrumbs>
      {check_student_needs_uni_assist(uniAssistListState.student) ? (
        <Fragment>
          <Typography sx={{ my: 2 }}>
            {t('Instructions: Follow the documentations in')}:{` `}
            <Link
              underline="hover"
              to={`${DEMO.UNI_ASSIST_DOCS_LINK}`}
              component={LinkDom}
              target="_blank"
            >
              Uni-Assist <LaunchIcon fontSize="small" />
            </Link>
          </Typography>
          <UniAssistListCard student={uniAssistListState.student} />
        </Fragment>
      ) : (
        <Card>
          <Typography>
            {t('Based on the applications, Uni-Assist is NOT needed')}
          </Typography>
        </Card>
      )}
    </>
  );
}
export default UniAssistList;
