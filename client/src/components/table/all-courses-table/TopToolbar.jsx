import { Link as LinkDom } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import {
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import i18next from 'i18next';

import DEMO from '../../../store/constant';

export const TopToolbar = ({ table, toolbarStyle, onDeleteClick }) => {
  console.log(table.getSelectedRowModel().rows);
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRow = table.getSelectedRowModel().rows[0]?.original;

  return (
    <Box sx={toolbarStyle}>
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} sx={{ height: '40px' }} />
      </Box>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          color="error"
          variant="contained"
          onClick={onDeleteClick}
          disabled={selectedRows?.length !== 1}
          startIcon={<DeleteIcon />}
          sx={{ mr: 1 }}
        >
          {i18next.t('Delete', { ns: 'common' })}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={LinkDom}
          disabled={selectedRows?.length !== 1}
          to={DEMO.COURSE_DATABASE_EDIT(selectedRow?._id)}
          sx={{ mr: 1 }}
        >
          {i18next.t('Edit', { ns: 'common' })}
        </Button>

        <Button
          color="primary"
          variant="contained"
          component={LinkDom}
          to={DEMO.COURSE_DATABASE_NEW}
        >
          {i18next.t('Add New Course')}
        </Button>
      </Stack>
    </Box>
  );
};
