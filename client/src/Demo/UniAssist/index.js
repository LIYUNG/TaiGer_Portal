import React, { Fragment } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Link, Typography, Card } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { is_TaiGer_Student } from '@taiger-common/core';

import UniAssistListCard from './UniAssistListCard';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { check_student_needs_uni_assist } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import { getStudentUniAssistQuery } from '../../api/query';

function UniAssistList() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery(
    getStudentUniAssistQuery({ studentId: user._id.toString() })
  );
  console.log(data);
  const { t } = useTranslation();

  if (!is_TaiGer_Student(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Uni-Assist & VPD');

  if (isLoading) {
    return <Loading />;
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
      {check_student_needs_uni_assist(data.data) ? (
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
          <UniAssistListCard student={data.data} />
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
