import React, { useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';

import ModalMain from '../Utils/ModalHandler/ModalMain';
import { createProgram } from '../../api';
// A great library for fuzzy filtering/sorting items
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import NewProgramEdit from './NewProgramEdit';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { getProgramsQuery } from '../../api/query';
import { ProgramsTable } from './ProgramsTable';

function ProgramList() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useQuery(getProgramsQuery());
  const programs = data?.data?.data;
  let [tableStates, setTableStates] = useState({
    success: false,
    isAssigning: false,
    isButtonDisable: false,
    error: null,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false,
    res_modal_status: 0,
    res_modal_message: ''
  });

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

  const ConfirmError = () => {
    setTableStates((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <>{error}</>;
  }

  const transformedData = programs.map((row) => {
    return {
      ...row, // Spread the original row object
      id: row._id // Map MongoDB _id to id property
      // other properties...
    };
  });

  return (
    <Box>
      {tableStates.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={tableStates.res_modal_status}
          res_modal_message={tableStates.res_modal_message}
        />
      )}

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
          <ProgramsTable isLoading={isLoading} data={transformedData} />
        </>
      )}
    </Box>
  );
}

export default ProgramList;
