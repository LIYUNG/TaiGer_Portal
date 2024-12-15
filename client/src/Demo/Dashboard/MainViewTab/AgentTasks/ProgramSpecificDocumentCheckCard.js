import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Alert,
  Typography,
  Link
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useAuth } from '../../../../components/AuthProvider';
import {
  AGENT_SUPPORT_DOCUMENTS_A,
  open_tasks
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function ProgramSpecificDocumentCheckCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const no_programs_student_tasks = open_tasks(props.students)
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .filter((open_task) =>
      [...AGENT_SUPPORT_DOCUMENTS_A].includes(open_task.file_type)
    )
    .filter((open_task) => open_task.show && !open_task.isFinalVersion);

  const programUpdateColumn = [
    {
      field: 'firstname_lastname',
      headerName: t('Name'),
      align: 'left',
      headerAlign: 'left',
      width: 120,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
            title={params.value}
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'deadline',
      headerName: t('Deadline', { ns: 'common' }),
      width: 120
    },
    {
      field: 'document_name',
      headerName: t('Document', { ns: 'common' }),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
          params.row.thread_id
        )}`;
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
    }
  ];

  return (
    <Card sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography>
          {t('Program Specific Documents Check', { ns: 'common' })}
        </Typography>
      </Alert>
      <DataGrid
        density="compact"
        rows={[...no_programs_student_tasks]}
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        columns={programUpdateColumn}
        pageSizeOptions={[6, 12, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 6 }
          }
        }}
      />
    </Card>
  );
}

export default ProgramSpecificDocumentCheckCard;
