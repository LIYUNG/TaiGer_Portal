import { Link as LinkDom } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import {
    MRT_GlobalFilterTextField as MRTGlobalFilterTextField,
    MRT_ToggleFiltersButton as MRTToggleFiltersButton
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
                <MRTGlobalFilterTextField table={table} />
                <MRTToggleFiltersButton sx={{ height: '40px' }} table={table} />
            </Box>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button
                    color="error"
                    disabled={selectedRows?.length !== 1}
                    onClick={onDeleteClick}
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 1 }}
                    variant="contained"
                >
                    {i18next.t('Delete', { ns: 'common' })}
                </Button>
                <Button
                    color="primary"
                    component={LinkDom}
                    disabled={selectedRows?.length !== 1}
                    sx={{ mr: 1 }}
                    to={DEMO.COURSE_DATABASE_EDIT(selectedRow?._id)}
                    variant="outlined"
                >
                    {i18next.t('Edit', { ns: 'common' })}
                </Button>

                <Button
                    color="primary"
                    component={LinkDom}
                    to={DEMO.COURSE_DATABASE_NEW}
                    variant="contained"
                >
                    {i18next.t('Add New Course')}
                </Button>
            </Stack>
        </Box>
    );
};
