import {
    Box,
    Button,
    Drawer,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import ExampleWithLocalizationProvider from '../../components/MaterialReactTable';
import {
    COUNTRIES_ARRAY_OPTIONS,
    SCHOOL_TAGS_DETAILED
} from '../../utils/contants';
import { useTranslation } from 'react-i18next';
import { updateSchoolAttributes } from '../../api';
import SearchableMultiSelect from '../../components/Input/searchableMuliselect';

const SchoolConfigContent = ({ data }) => {
    const c1_mrt = [
        {
            accessorKey: 'school',
            filterVariant: 'autocomplete',
            filterFn: 'contains',
            header: 'School',
            size: 240
        },
        {
            accessorKey: 'count',
            header: 'Count',
            size: 150,
            Cell: (params) => {
                return (
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {params.row.original?.count}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'schoolType',
            header: 'School Type',
            size: 150,
            Cell: (params) => {
                return (
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {params.row.original?.schoolType}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'isPrivateSchool',
            header: 'isPrivateSchool',
            size: 150,
            Cell: (params) => {
                return (
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {params.row.original?.isPrivateSchool ? 'Yes' : 'No'}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'isPartnerSchool',
            header: 'isPartnerSchool',
            size: 150,
            Cell: (params) => {
                return (
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {params.row.original?.isPartnerSchool ? 'Yes' : 'No'}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'country',
            header: 'Country',
            size: 150,
            Cell: (params) => {
                return (
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    >
                        {params.row.original?.country}
                    </Box>
                );
            }
        }
    ];

    const [distinctSchoolsState, setDistinctSchoolsState] = useState(data);
    const memoizedColumnsMrt = useMemo(() => c1_mrt, [c1_mrt]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useTranslation();
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleSchoolClick = (row) => {
        setRowSelection(row);
        if (isSmallScreen) {
            setDrawerOpen(true); // Open the Drawer on small screens
        }
    };

    const EditCard = (props) => {
        const [attributes, setAttributes] = useState(props.data);
        const handleChange = async (e, school) => {
            e.preventDefault();
            setAttributes({
                ...attributes,
                school,
                [e.target.name]: e.target.value
            });
        };

        const handleChangeByField = (field, school) => (value) => {
            const newState = { ...school };
            if (value === school[field] || (!school[field] && !value)) {
                delete newState[field];
            } else {
                newState[field] = value;
            }
            setAttributes({
                ...attributes,
                school,
                [field]: value
            });
        };

        const handleSave = async () => {
            props.setDistinctSchoolsState((prevState) => {
                // Check if the attributes object already exists in the state based on a unique key (e.g., id)
                const index = prevState.findIndex(
                    (item) => item.school === attributes.school
                );

                if (index !== -1) {
                    // If found, update the existing object
                    return prevState.map((item, i) =>
                        i === index ? { ...item, ...attributes } : item
                    );
                } else {
                    // If not found, add the new object to the array
                    return [...prevState, attributes];
                }
            });

            const resp = await updateSchoolAttributes(attributes);
            const { success } = resp.data;
            if (!success) {
                console.log('warning');
            }
        };

        return (
            <Box>
                <form onSubmit={(e) => handleSave(e)}>
                    <Typography variant="h6">
                        {t('School', { ns: 'common' })}: {attributes.school}
                    </Typography>
                    <Typography sx={{ mb: 2 }} variant="subtitle1">
                        {t('Programs Count', { ns: 'common' })}:{' '}
                        {attributes.count}
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="select-target-group">
                            {t('Is Private School', { ns: 'common' })}
                        </InputLabel>
                        <Select
                            defaultValue={attributes.isPrivateSchool ?? false}
                            id="isPrivateSchool"
                            label={t('Is Private School', { ns: 'common' })}
                            labelId="isPrivateSchool"
                            name="isPrivateSchool"
                            onChange={(e) => handleChange(e, props.data.school)}
                        >
                            <MenuItem value={true}>
                                {t('Yes', { ns: 'common' })}
                            </MenuItem>
                            <MenuItem value={false}>
                                {t('No', { ns: 'common' })}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="select-target-group">
                            {t('Is Partner School', { ns: 'common' })}
                        </InputLabel>
                        <Select
                            defaultValue={attributes.isPartnerSchool ?? false}
                            id="isPartnerSchool"
                            label={t('Is Partner School', { ns: 'common' })}
                            labelId="isPartnerSchool"
                            name="isPartnerSchool"
                            onChange={(e) => handleChange(e, props.data.school)}
                        >
                            <MenuItem value={true}>
                                {t('Yes', { ns: 'common' })}
                            </MenuItem>
                            <MenuItem value={false}>
                                {t('No', { ns: 'common' })}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="select-target-group">
                            {t('Country', { ns: 'common' })}
                        </InputLabel>
                        <Select
                            defaultValue={attributes.country ?? '-'}
                            id="country"
                            label={t('Country', { ns: 'common' })}
                            labelId="country"
                            name="country"
                            onChange={(e) => handleChange(e, props.data.school)}
                        >
                            {COUNTRIES_ARRAY_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="select-target-group">
                            {t('School Type', { ns: 'common' })}
                        </InputLabel>
                        <Select
                            defaultValue={attributes.schoolType ?? '-'}
                            id="schoolType"
                            label={t('School Type', { ns: 'common' })}
                            labelId="schoolType"
                            name="schoolType"
                            onChange={(e) => handleChange(e, props.data.school)}
                        >
                            <MenuItem value="-">
                                {t('Please Select', { ns: 'common' })}
                            </MenuItem>
                            <MenuItem value="University">
                                {t('University', { ns: 'common' })}
                            </MenuItem>
                            <MenuItem value="University_of_Applied_Sciences">
                                {t('University of Applied Sciences', {
                                    ns: 'common'
                                })}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <SearchableMultiSelect
                        data={SCHOOL_TAGS_DETAILED}
                        label={null}
                        name="tags"
                        setValue={handleChangeByField(
                            'tags',
                            props.data.school
                        )}
                        value={attributes.tags ?? []}
                    />
                    {/* Additional configuration details go here */}
                    <Button color="primary" type="submit" variant="contained">
                        {t('Update', { ns: 'common' })}
                    </Button>
                </form>
            </Box>
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                {/* Left side: School list */}
                <Grid
                    item
                    md={
                        Object.keys(rowSelection) &&
                        Object.keys(rowSelection)[0]
                            ? 7
                            : 12
                    }
                    xs={12}
                >
                    <Paper style={{ padding: 16 }}>
                        <ExampleWithLocalizationProvider
                            col={memoizedColumnsMrt}
                            data={distinctSchoolsState}
                            enableMultiRowSelection={false}
                            enableRowSelection={true}
                            muiTableBodyRowProps={({ row }) => ({
                                //add onClick to row to select upon clicking anywhere in the row
                                onClick: row.getToggleSelectedHandler(),
                                sx: { cursor: 'pointer' }
                            })}
                            onRowSelectionChange={(e) => handleSchoolClick(e)}
                            rowSelection={rowSelection}
                        />
                    </Paper>
                </Grid>

                {/* Right side: Configuration panel */}
                {!isSmallScreen ? <Grid item md={5} xs={12}>
                        <Paper style={{ padding: 16 }}>
                            {Object.keys(rowSelection) &&
                            Object.keys(rowSelection)[0] ? (
                                <EditCard
                                    data={
                                        distinctSchoolsState[
                                            parseInt(
                                                Object.keys(rowSelection)[0]
                                            )
                                        ]
                                    }
                                    setDistinctSchoolsState={
                                        setDistinctSchoolsState
                                    }
                                />
                            ) : (
                                <Typography variant="h6">
                                    Select a school to configure
                                </Typography>
                            )}
                        </Paper>
                    </Grid> : null}
            </Grid>

            {/* Drawer for small screens */}
            <Drawer
                anchor="right"
                onClose={handleDrawerClose}
                open={drawerOpen}
            >
                <div style={{ width: 300, padding: 16 }}>
                    {Object.keys(rowSelection) &&
                    Object.keys(rowSelection)[0] ? (
                        <EditCard
                            data={
                                distinctSchoolsState[
                                    parseInt(Object.keys(rowSelection)[0])
                                ]
                            }
                            setDistinctSchoolsState={setDistinctSchoolsState}
                        />
                    ) : (
                        <Typography variant="h6">
                            Select a school to configure
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        onClick={handleDrawerClose}
                        variant="contained"
                    >
                        Close
                    </Button>
                </div>
            </Drawer>
        </>
    );
};
export default SchoolConfigContent;
