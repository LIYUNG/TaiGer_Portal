import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    lighten,
    Radio,
    RadioGroup
} from '@mui/material';
import { PROGRAM_SUBJECTS } from '@taiger-common/core';
import i18next from 'i18next';
import {
    MaterialReactTable,
    MRT_GlobalFilterTextField as MRTGlobalFilterTextField,
    MRT_ToggleFiltersButton as MRTToggleFiltersButton,
    useMaterialReactTable
} from 'material-react-table';
import { useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import CourseAnalysisConfirmDialog from '../../Demo/MyCourses/CourseAnalysisConfirmDialog';

export const ProgramRequirementsTable = ({ data, onAnalyseV2 }) => {
    const [language, setLanguage] = useState('zh'); // 'en' for English, 'zh' for 中文
    const [isAnalysingV2, setIsAnalysingV2] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    let [statedata, setStatedata] = useState({});
    const setModalHide = () => {
        setStatedata((state) => ({
            ...state,
            modalShowAssignWindow: false
        }));
    };

    const onAnalyse = async (e) => {
        e.preventDefault();
        setIsAnalysingV2(true);
        await onAnalyseV2(
            Object.keys(rowSelection)?.map((idx) => data[idx]?._id),
            language
        );
        setIsAnalysingV2(false);
        setModalHide();
    };

    const setModalShow2 = () => {
        setStatedata((state) => ({
            ...state,
            modalShowAssignWindow: true
        }));
    };

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'program_name', //id is still required when using accessorFn instead of accessorKey
                header: 'Program Name',
                size: 450,
                Cell: ({ renderedCellValue }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                )
            },
            {
                accessorKey: 'attributes', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                filterVariant: 'multi-select',
                filterSelectOptions: Object.keys(PROGRAM_SUBJECTS), //custom options list (as opposed to faceted list)
                header: 'Attributes',
                size: 90
                // Filter: ({ column }) => (
                //   <MaterialReactTable.MRT_FilterDropdown
                //     options={Object.keys(PROGRAM_SUBJECTS)}
                //     onSelectChange={(selectedValues) => {
                //       // Handle changes to the selected values here
                //     }}
                //     renderOption={(option, { selected }) => (
                //       <MenuItem key={option} value={option}>
                //         <Checkbox checked={selected} />
                //         <ListItemText primary={PROGRAM_SUBJECTS[option]} />
                //       </MenuItem>
                //     )}
                //   />
                // )
            },
            {
                accessorKey: 'country', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                // enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Country',
                size: 90
            },
            {
                accessorKey: 'updatedAt', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                // enableClickToCopy: true,
                header: 'updatedAt',
                size: 90
            }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowSelection: true,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select']
            }
        },
        muiTableBodyRowProps: ({ row }) => ({
            //add onClick to row to select upon clicking anywhere in the row
            onClick: row.getToggleSelectedHandler(),
            sx: { cursor: 'pointer' }
        }),
        onRowSelectionChange: setRowSelection,
        state: { rowSelection },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined'
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined'
        },

        renderTopToolbar: ({ table }) => {
            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(
                            theme.palette.background.default,
                            0.05
                        ),
                        display: 'flex',
                        gap: '0.5rem',
                        p: '8px',
                        justifyContent: 'space-between'
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <MRTGlobalFilterTextField table={table} />
                        <MRTToggleFiltersButton table={table} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="language"
                                name="language"
                                onChange={handleLanguageChange}
                                row
                                value={language}
                            >
                                <FormControlLabel
                                    control={<Radio />}
                                    label="English"
                                    value="en"
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="中文"
                                    value="zh"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                color="primary"
                                disabled={
                                    !Object.keys(rowSelection)?.length > 0
                                }
                                endIcon={
                                    statedata.isAnalysingV2 ? (
                                        <CircularProgress size={24} />
                                    ) : null
                                }
                                onClick={setModalShow2}
                                variant="contained"
                            >
                                {statedata.isAnalysingV2
                                    ? i18next.t('Analysing', { ns: 'courses' })
                                    : i18next.t('Analyse V2', {
                                          ns: 'courses'
                                      })}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
            <CourseAnalysisConfirmDialog
                data={Object.keys(rowSelection)?.map((idx) => data[idx])}
                isButtonDisable={
                    isAnalysingV2 || !Object.keys(rowSelection)?.length > 0
                }
                onAnalyse={onAnalyse}
                setModalHide={setModalHide}
                show={statedata.modalShowAssignWindow}
            />
        </LocalizationProvider>
    );
};
