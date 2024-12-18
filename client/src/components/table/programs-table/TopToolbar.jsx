import { Box } from '@mui/material';
import {
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from 'material-react-table';

export const TopToolbar = ({ table, toolbarStyle }) => {
  return (
    <Box sx={toolbarStyle}>
      <Box>
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} sx={{ height: '40px' }} />
      </Box>
    </Box>
  );
};
