import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DEMO from '../../store/constant';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ProgramUpdateStatusTable = ({ data }) => {
    const { t } = useTranslation();
    let result = [];
    var set = new Set();

    data.forEach((program) => {
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                columns={programUpdateColumn}
                density="compact"
                disableColumnFilter
                disableColumnMenu
                disableDensitySelector
                rows={[...result]}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true
                    }
                }}
                slots={{ toolbar: GridToolbar }}
            />
        </Box>
    );
};

export default ProgramUpdateStatusTable;
