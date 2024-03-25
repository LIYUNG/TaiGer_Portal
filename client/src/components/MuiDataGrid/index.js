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

  return (
    <div style={{ height: '50%', width: '100%' }}>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: 'normal'
          },
          '& .MuiDataGrid-columnHeader': {
            // Forced to use important since overriding inline styles
            height: 'unset !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            // Forced to use important since overriding inline styles
            maxHeight: '168px !important'
          }
        }}
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
        disableColumnFilter
        disableColumnMenu
        disableDensitySelector
        columns={props.columns.map((column) => ({
          ...column,
          renderHeader: () => (
            <Box>
              <Tooltip
                title={`${t('column.headerName')}`}
                key={column.headerName}
              >
                <Typography
                  sx={{ my: 1 }}
                  title={`${t('column.headerName')}`}
                >{`${column.headerName}`}</Typography>
              </Tooltip>
              <TextField
                fullWidth
                size="small"
                type="text"
                placeholder={`${column.headerName}`}
                onClick={stopPropagation}
                value={filters[column.field] || ''}
                onChange={(event) => handleFilterChange(event, column)}
                sx={{ mb: 1 }}
              />
            </Box>
          )
        }))}
        initialState={{
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
      ></DataGrid>
    </div>
  );
};
