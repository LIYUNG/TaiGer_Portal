import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

export const MuiDataGrid = (props) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
  };

  const stopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const autosizeOptions = {
    includeHeaders: true,
    includeOutliers: true,
    expand: true
  };
  return (
    <div style={{ height: '50%', width: '100%' }}>
      <DataGrid
        density="compact"
        rows={props.rows.filter((row) => {
          return Object.keys(filters).every((field) => {
            const filterValue = filters[field];
            if (row[field]?.length > 0) {
              return (
                filterValue === '' ||
                JSON.stringify(row[field]).toLowerCase().includes(filterValue)
              );
            } else {
              return (
                filterValue === '' ||
                row[field]?.toString().toLowerCase().includes(filterValue)
              );
            }
          });
        })}
        columnHeaderHeight={130}
        autosizeOnMount={true}
        disableColumnResize={false}
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        columns={props.columns.map((column) => ({
          ...column,
          renderHeader: () => (
            <Box>
              <Tooltip
                title={`${t(`${column.headerName}`, { ns: 'common' })}`}
                key={column.headerName}
              >
                <Typography sx={{ my: 1 }}>
                  {t(`${column.headerName}`, { ns: 'common' })}
                </Typography>
              </Tooltip>
              <TextField
                fullWidth
                size="small"
                type="text"
                placeholder={t(`${column.headerName}`, { ns: 'common' })}
                onClick={stopPropagation}
                value={filters[column.field] || ''}
                onChange={(event) => handleFilterChange(event, column)}
                sx={{ mb: 1 }}
              />
            </Box>
          )
        }))}
        initialState={{
          columns: {
            columnVisibilityModel: { ...props.columnVisibilityModel }
          },
          pagination: {
            paginationModel: { page: 0, pageSize: 20 }
          }
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        autosizeOptions={autosizeOptions}
      ></DataGrid>
    </div>
  );
};
