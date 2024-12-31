import { Link as LinkDom } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import {
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';

import DEMO from '../../../store/constant';
import { useTranslation } from 'react-i18next';

export const TopToolbar = ({ table, toolbarStyle, onDeleteClick }) => {
  const { t } = useTranslation();
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
          disabled={table.getSelectedRowModel().rows?.length !== 1}
          startIcon={<DeleteIcon />}
          sx={{ mr: 1 }}
        >
          {t('Delete', { ns: 'common' })}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={LinkDom}
          disabled={table.getSelectedRowModel().rows?.length !== 1}
          to={DEMO.COURSE_DATABASE_EDIT}
          sx={{ mr: 1 }}
        >
          {t('Edit', { ns: 'common' })}
        </Button>

        <Button
          color="primary"
          variant="contained"
          component={LinkDom}
          to={DEMO.COURSE_DATABASE_NEW}
        >
          {t('Add New Course')}
        </Button>
      </Stack>
    </Box>
  );
};
