/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link } from '@mui/material';
import PropTypes from 'prop-types';

import DEMO from '../../store/constant';
import { CustomTabPanel } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import { MuiDataGrid } from '../../components/MuiDataGrid';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function AdmissionsStat(props) {
  const result = props.result;
  const { t } = useTranslation();

  const admisstionStatColumns = [
    {
      field: 'school',
      headerName: 'School',
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'program_name',
      headerName: 'Program',
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    { field: 'degree', headerName: 'Degree', width: 120 },
    {
      field: 'semester',
      headerName: t('Semester', { ns: 'common' }),
      width: 120
    },
    {
      field: 'applicationCount',
      headerName: t('applicationCount', { ns: 'common' }),
      width: 150
    },
    {
      field: 'admissionCount',
      headerName: t('admissionCount', { ns: 'common' }),
      width: 120
    },
    {
      field: 'rejectionCount',
      headerName: t('rejectionCount', { ns: 'common' }),
      width: 120
    },
    {
      field: 'pendingResultCount',
      headerName: t('pendingResultCount', { ns: 'common' }),
      width: 120
    }
  ];
  const memoizedColumns = useMemo(
    () => admisstionStatColumns,
    [admisstionStatColumns]
  );

  return (
    <>
      <MuiDataGrid rows={result} columns={memoizedColumns} />
    </>
  );
}

export default AdmissionsStat;
