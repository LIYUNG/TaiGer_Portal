import { Link as LinkDom } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import {
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton
} from 'material-react-table';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import DEMO from '../../../store/constant';
import { useTranslation } from 'react-i18next';

export const TopToolbar = ({ table, toolbarStyle, onAssignClick }) => {
    const { t } = useTranslation();
    return (
        <Box sx={toolbarStyle}>
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <MRT_GlobalFilterTextField table={table} />
                <MRT_ToggleFiltersButton
                    table={table}
                    sx={{ height: '40px' }}
                />
            </Box>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                    color="success"
                    variant="contained"
                    onClick={onAssignClick}
                    disabled={table.getSelectedRowModel().rows?.length === 0}
                    startIcon={<PersonAddIcon />}
                    sx={{ mr: 1 }}
                >
                    {t('Assign', { ns: 'common' })}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    component={LinkDom}
                    to={DEMO.PROGRAM_ANALYSIS}
                    sx={{ mr: 1 }}
                >
                    {t('Program Requirements', { ns: 'common' })}
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    component={LinkDom}
                    to={DEMO.SCHOOL_CONFIG}
                    sx={{ mr: 1 }}
                >
                    {t('School Configuration', { ns: 'common' })}
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    component={LinkDom}
                    to={DEMO.NEW_PROGRAM}
                >
                    {t('Add New Program')}
                </Button>
            </Stack>
        </Box>
    );
};
