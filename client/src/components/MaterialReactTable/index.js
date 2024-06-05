import React from 'react';

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';

import { Box, Typography } from '@mui/material';

const MRTable = ({
  columns,
  data,
  hasDetailPanel,
  hasCheckBox,
  columnVisibilityModel
}) => {
  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnFilters: true,
    // enableRowActions: true,
    enableRowSelection: hasCheckBox ? true : false,
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
    },
    renderDetailPanel: hasDetailPanel
      ? ({ row }) => (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-around',
              left: '30px',
              maxWidth: '1000px',
              position: 'sticky',
              width: '100%'
            }}
          >
            <img
              alt="avatar"
              height={200}
              src={row.original.avatar}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">Signature Catch Phrase:</Typography>
              <Typography variant="h1">
                &quot;{row.original.signatureCatchPhrase}&quot;
              </Typography>
            </Box>
          </Box>
        )
      : undefined
  });

  return <MaterialReactTable table={table} />;
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExampleWithLocalizationProvider = ({ col, data }) => {
  //App.tsx or AppProviders file

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MRTable columns={col} data={data} />
    </LocalizationProvider>
  );
};

export default ExampleWithLocalizationProvider;
