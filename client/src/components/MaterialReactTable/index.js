import React from 'react';

//MRT Imports
import {
    MaterialReactTable,
    useMaterialReactTable
} from 'material-react-table';

const MRTable = ({
    columns,
    data,
    enableRowSelection,
    enableMultiRowSelection,
    muiTableBodyRowProps,
    onRowSelectionChange,
    rowSelection,
    columnVisibilityModel
}) => {
    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        onRowSelectionChange: onRowSelectionChange ?? null,
        state: rowSelection ? { rowSelection } : null,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        enableColumnResizing: true,
        enableColumnFilters: true,
        // enableRowActions: true,
        enableRowSelection: enableRowSelection ?? false,
        enableMultiRowSelection: enableMultiRowSelection ?? false,
        muiTableBodyRowProps: muiTableBodyRowProps ?? null,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            density: 'compact',
            columnVisibilityModel: { ...columnVisibilityModel },
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions']
            },
            pagination: { pageSize: 20, pageIndex: 0 }
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined'
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 50, 100],
            shape: 'rounded',
            variant: 'outlined'
        }
    });

    return <MaterialReactTable table={table} />;
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExampleWithLocalizationProvider = ({
    col,
    data,
    enableRowSelection,
    enableMultiRowSelection,
    muiTableBodyRowProps,
    onRowSelectionChange,
    rowSelection
}) => {
    //App.tsx or AppProviders file

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MRTable
                columns={col}
                data={data}
                enableMultiRowSelection={enableMultiRowSelection}
                enableRowSelection={enableRowSelection}
                muiTableBodyRowProps={muiTableBodyRowProps}
                onRowSelectionChange={onRowSelectionChange}
                rowSelection={rowSelection}
            />
        </LocalizationProvider>
    );
};

export default ExampleWithLocalizationProvider;
