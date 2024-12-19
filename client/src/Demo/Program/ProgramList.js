import React, { useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';

import { createProgram } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import NewProgramEdit from './NewProgramEdit';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { getProgramsQuery } from '../../api/query';
import { ProgramsTable } from './ProgramsTable';

function ProgramList() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useQuery(getProgramsQuery());
  const programs = data?.data?.data;

  let [isCreationMode, setIsCreationMode] = useState(false);

  TabTitle(t('Program List', { ns: 'common' }));

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const onClickIsCreateApplicationMode = () => {
    setIsCreationMode(!isCreationMode);
  };

  const handleSubmit_Program = (program) => {
    createProgram(program).then(
      () => {},
      () => {}
    );
  };

  if (isError) {
    return <>{error}</>;
  }

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
        <Typography color="text.primary">
          {t('Program List', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      {isCreationMode ? (
        <>
          <NewProgramEdit
            handleClick={onClickIsCreateApplicationMode}
            handleSubmit_Program={handleSubmit_Program}
            programs={programs}
            isSubmitting={false}
            type={'create'}
          />
        </>
      ) : (
        <>
          <ProgramsTable isLoading={isLoading} data={programs} />
        </>
      )}
    </Box>
  );
}

export default ProgramList;
