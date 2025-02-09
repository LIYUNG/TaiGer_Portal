import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const MuiDataGrid = (props) => {
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
                autosizeOnMount={true}
                autosizeOptions={autosizeOptions}
                columnHeaderHeight={130}
                columns={props.columns.map((column) => ({
                    ...column,
                    renderHeader: () => (
                        <Box>
                            <Tooltip
                                key={column.headerName}
                                title={column.headerName}
                            >
                                <Typography sx={{ my: 1 }}>
                                    {column.headerName}
                                </Typography>
                            </Tooltip>
                            <TextField
                                fullWidth
                                onChange={(event) =>
                                    handleFilterChange(event, column)
                                }
                                onClick={stopPropagation}
                                placeholder={column.headerName}
                                size="small"
                                sx={{ mb: 1 }}
                                type="text"
                                value={filters[column.field] || ''}
                            />
                        </Box>
                    )
                }))}
                density="compact"
                disableColumnFilter
                disableColumnMenu
                disableColumnResize={false}
                disableDensitySelector
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            ...props.columnVisibilityModel
                        }
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20 }
                    }
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                rows={props.rows.filter((row) => {
                    return Object.keys(filters).every((field) => {
                        const filterValue = filters[field];
                        if (row[field]?.length > 0) {
                            return (
                                filterValue === '' ||
                                JSON.stringify(row[field])
                                    .toLowerCase()
                                    .includes(filterValue)
                            );
                        } else {
                            return (
                                filterValue === '' ||
                                row[field]
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(filterValue)
                            );
                        }
                    });
                })}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true
                    }
                }}
                slots={{ toolbar: GridToolbar }}
            />
        </div>
    );
};
