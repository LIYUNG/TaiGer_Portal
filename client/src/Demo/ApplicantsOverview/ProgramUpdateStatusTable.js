import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DEMO from '../../store/constant';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function ProgramUpdateStatusTable(props) {
  const { t } = useTranslation();
  let result = [];
  var set = new Set();

  props.data.forEach((program) => {
    if (!set.has(program.program_id)) {
      set.add(program.program_id);
      program.id = program.program_id;
      result.push(program);
    }
  });

  const programUpdateColumn = [
    {
      field: 'school',
      headerName: t('School'),
      align: 'left',
      headerAlign: 'left',
      width: 300,
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
      headerName: t('Program', { ns: 'common' }),
      width: 300,
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
      field: 'degree',
      headerName: t('Degree', { ns: 'common' }),
      width: 120
    },
    {
      field: 'semester',
      headerName: t('Semester', { ns: 'common' }),
      width: 120
    },
    {
      field: 'whoupdated',
      headerName: t('Updated by', { ns: 'common' }),
      width: 120
    },
    {
      field: 'updatedAt',
      headerName: t('Last update', { ns: 'common' }),
      width: 150
    }
  ];

  return (
    <Box>
      <DataGrid
        density="compact"
        rows={[...result]}
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        columns={programUpdateColumn}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
      />
    </Box>
  );
}

export default ProgramUpdateStatusTable;
