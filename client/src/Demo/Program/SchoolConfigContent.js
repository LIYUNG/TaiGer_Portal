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
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('Programs Count', { ns: 'common' })}: {attributes.count}
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="select-target-group">
              {t('Is Private School', { ns: 'common' })}
            </InputLabel>
            <Select
              labelId="isPrivateSchool"
              label={t('Is Private School', { ns: 'common' })}
              name="isPrivateSchool"
              id="isPrivateSchool"
              defaultValue={attributes.isPrivateSchool ?? false}
              onChange={(e) => handleChange(e, props.data.school)}
            >
              <MenuItem value={true}>{t('Yes', { ns: 'common' })}</MenuItem>
              <MenuItem value={false}>{t('No', { ns: 'common' })}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="select-target-group">
              {t('Is Partner School', { ns: 'common' })}
            </InputLabel>
            <Select
              labelId="isPartnerSchool"
              label={t('Is Partner School', { ns: 'common' })}
              name="isPartnerSchool"
              id="isPartnerSchool"
              defaultValue={attributes.isPartnerSchool ?? false}
              onChange={(e) => handleChange(e, props.data.school)}
            >
              <MenuItem value={true}>{t('Yes', { ns: 'common' })}</MenuItem>
              <MenuItem value={false}>{t('No', { ns: 'common' })}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="select-target-group">
              {t('Country', { ns: 'common' })}
            </InputLabel>
            <Select
              labelId="country"
              label={t('Country', { ns: 'common' })}
              name="country"
              id="country"
              defaultValue={attributes.country ?? '-'}
              onChange={(e) => handleChange(e, props.data.school)}
            >
              {COUNTRIES_ARRAY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
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
              labelId="schoolType"
              label={t('School Type', { ns: 'common' })}
              name="schoolType"
              id="schoolType"
              defaultValue={attributes.schoolType ?? '-'}
              onChange={(e) => handleChange(e, props.data.school)}
            >
              <MenuItem value={'-'}>
                {t('Please Select', { ns: 'common' })}
              </MenuItem>
              <MenuItem value={'University'}>
                {t('University', { ns: 'common' })}
              </MenuItem>
              <MenuItem value={'University_of_Applied_Sciences'}>
                {t('University of Applied Sciences', { ns: 'common' })}
              </MenuItem>
            </Select>
          </FormControl>
          <SearchableMultiSelect
            name="tags"
            label={null}
            data={SCHOOL_TAGS_DETAILED}
            value={attributes.tags ?? []}
            setValue={handleChangeByField('tags', props.data.school)}
          />
          {/* Additional configuration details go here */}
          <Button variant="contained" color="primary" type="submit">
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
          xs={12}
          md={
            Object.keys(rowSelection) && Object.keys(rowSelection)[0] ? 7 : 12
          }
        >
          <Paper style={{ padding: 16 }}>
            <ExampleWithLocalizationProvider
              data={distinctSchoolsState}
              col={memoizedColumnsMrt}
              enableRowSelection={true}
              enableMultiRowSelection={false}
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
        {!isSmallScreen && (
          <Grid item xs={12} md={5}>
            <Paper style={{ padding: 16 }}>
              {Object.keys(rowSelection) && Object.keys(rowSelection)[0] ? (
                <EditCard
                  data={
                    distinctSchoolsState[parseInt(Object.keys(rowSelection)[0])]
                  }
                  setDistinctSchoolsState={setDistinctSchoolsState}
                />
              ) : (
                <Typography variant="h6">
                  Select a school to configure
                </Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Drawer for small screens */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: 300, padding: 16 }}>
          {Object.keys(rowSelection) && Object.keys(rowSelection)[0] ? (
            <EditCard
              data={
                distinctSchoolsState[parseInt(Object.keys(rowSelection)[0])]
              }
              setDistinctSchoolsState={setDistinctSchoolsState}
            />
          ) : (
            <Typography variant="h6">Select a school to configure</Typography>
          )}
          <Button onClick={handleDrawerClose} variant="contained" fullWidth>
            Close
          </Button>
        </div>
      </Drawer>
    </>
  );
};
export default SchoolConfigContent;
