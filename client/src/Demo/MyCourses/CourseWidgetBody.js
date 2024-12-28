import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Card,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
  Badge,
  Tabs,
  Tab,
  lighten,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-datasheet-grid/dist/style.css';
import { is_TaiGer_role, PROGRAM_SUBJECTS } from '@taiger-common/core';

import { convertDateUXFriendly, study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  WidgetanalyzedFileDownload,
  WidgetTranscriptanalyser,
  WidgetTranscriptanalyserV2
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  useMaterialReactTable
} from 'material-react-table';
import CourseAnalysisConfirmDialog from './CourseAnalysisConfirmDialog';
import { useSnackBar } from '../../contexts/use-snack-bar';

const ProgramRequirementsTable = ({ data, onAnalyseV2 }) => {
  const [language, setLanguage] = useState('zh'); // 'en' for English, 'zh' for 中文
  const [isAnalysingV2, setIsAnalysingV2] = useState(false);
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  let [statedata, setStatedata] = useState({});
  const setModalHide = () => {
    setStatedata((state) => ({
      ...state,
      modalShowAssignWindow: false
    }));
  };

  const onAnalyse = async () => {
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
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            justifyContent: 'space-between'
          })}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="language"
                name="language"
                value={language}
                onChange={handleLanguageChange}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label="English"
                />
                <FormControlLabel value="zh" control={<Radio />} label="中文" />
              </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color="primary"
                variant="contained"
                onClick={setModalShow2}
                disabled={!Object.keys(rowSelection)?.length > 0}
                endIcon={
                  statedata.isAnalysing ? <CircularProgress size={24} /> : <></>
                }
              >
                {statedata.isAnalysing
                  ? t('Analysing', { ns: 'courses' })
                  : t('Analyse V2', { ns: 'courses' })}
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <CourseAnalysisConfirmDialog
        show={statedata.modalShowAssignWindow}
        setModalHide={setModalHide}
        data={Object.keys(rowSelection)?.map((idx) => data[idx])}
        isButtonDisable={
          isAnalysingV2 || !Object.keys(rowSelection)?.length > 0
        }
        onAnalyse={onAnalyse}
      />
    </>
  );
};

export default function CourseWidgetBody({ programRequirements }) {
  const { user } = useAuth();
  const { student_id } = useParams();
  const { t } = useTranslation();
  const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: true,
    coursesdata: [
      {
        course_chinese: '電子學',
        course_english: 'Electronics',
        credits: '3',
        grades: 'B'
      }
    ],
    analysis: {},
    success: false,
    student: null,
    file: '',
    study_group: '',
    analysis_language: '',
    analyzed_course: '',
    isAnalysing: false,
    isDownloading: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const [value, setValue] = useState(0);

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  const onChange = (new_data) => {
    setStatedata((state) => ({
      ...state,
      coursesdata: new_data
    }));
  };

  const handleChange_study_group = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((state) => ({
      ...state,
      study_group: value
    }));
  };

  const handleChange_analysis_language = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((state) => ({
      ...state,
      analysis_language: value
    }));
  };

  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const onAnalyse = () => {
    if (statedata.study_group === '') {
      alert('Please select study group');
      return;
    }
    setStatedata((state) => ({
      ...state,
      isAnalysing: true
    }));
    WidgetTranscriptanalyser(
      statedata.study_group,
      statedata.analysis_language,
      statedata.coursesdata,
      []
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setSeverity('success');
          setMessage(t('Transcript analysed successfully!'));
          setOpenSnackbar(true);
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            analysis: data,
            success: success,
            isAnalysing: false,
            res_modal_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            isAnalysing: false,
            res_modal_status: status,
            res_modal_message:
              'Make sure that you updated your courses and select the right target group and language!'
          }));
        }
      },
      (error) => {
        setSeverity('error');
        setMessage(error.message || 'An error occurred. Please try again.');
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isAnalysing: false,
          error,
          res_modal_status: 500,
          res_modal_message:
            'Make sure that you updated your courses and select the right target group and language!'
        }));
      }
    );
  };

  const onDownload = () => {
    setStatedata((state) => ({
      ...state,
      isDownloading: true
    }));
    WidgetanalyzedFileDownload(user._id.toString()).then(
      (resp) => {
        // TODO: timeout? success?
        const { status } = resp;
        if (status < 300) {
          const actualFileName = decodeURIComponent(
            resp.headers['content-disposition'].split('"')[1]
          ); //  檔名中文亂碼 solved
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split('.'); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === 'pdf') {
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: 'application/pdf' })
            );

            //Open the URL on new Window
            window.open(url); //TODO: having a reasonable file name, pdf viewer
          } else {
            //if not pdf, download instead.

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', actualFileName);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            setStatedata((state) => ({
              ...state,
              isDownloading: false
            }));
          }
        } else {
          const { statusText } = resp;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: statusText,
            isDownloading: false
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: '',
          isDownloading: false
        }));
      }
    );
  };

  const transformedData = programRequirements.map((row) => {
    return {
      ...row, // Spread the original row object
      program_name: `${row.programId[0].school} ${row.programId[0].program_name} ${row.programId[0].degree}`,
      lang: `${row.programId[0].lang}`,
      degree: `${row.programId[0].degree}`,
      attributes: `${row.attributes.join('-')}`,
      country: `${row.programId[0].country}`,
      updatedAt: convertDateUXFriendly(row.updatedAt),
      id: row._id // Map MongoDB _id to id property
      // other properties...
    };
  });

  const onAnalyseV2 = async (requirementIds, lang) => {
    setStatedata((state) => ({
      ...state,
      isAnalysing: true
    }));

    try {
      const resp = await WidgetTranscriptanalyserV2(
        lang,
        statedata.coursesdata,
        requirementIds
      );

      const { data, success } = resp.data;
      const { status } = resp;
      if (success) {
        setSeverity('success');
        setMessage(t('Transcript analysed successfully!'));
        setOpenSnackbar(true);
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          analysis: data,
          success: success,
          isAnalysing: false,
          res_modal_status: status
        }));
      } else {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isAnalysing: false,
          res_modal_status: status,
          res_modal_message:
            'Make sure that you updated your courses and select the right target group and language!'
        }));
      }
    } catch (error) {
      setSeverity('error');
      setMessage(error.message || 'An error occurred. Please try again.');
      setStatedata((state) => ({
        ...state,
        isLoaded: true,
        isAnalysing: false,
        error,
        res_modal_status: 500,
        res_modal_message:
          'Make sure that you updated your courses and select the right target group and language!'
      }));
    }
  };

  const columns = [
    {
      ...keyColumn('course_chinese', textColumn),
      title: 'Courses Name Chinese'
    },
    {
      ...keyColumn('course_english', textColumn),
      title: 'Courses Name English'
    },
    {
      ...keyColumn('credits', textColumn),
      title: 'Credits'
    },
    { ...keyColumn('grades', textColumn), title: 'Grades' }
  ];

  if (!statedata.isLoaded) {
    return <Loading />;
  }
  if (!student_id) {
    if (!is_TaiGer_role(user)) {
      return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }
  TabTitle(`Course Analyser`);

  return (
    <Box>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 1 }}
      >
        <Typography variant="h6">
          {t('Course Analyser', { ns: 'common' })}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            component={LinkDom}
            to={`${DEMO.KEYWORDS_EDIT}`}
            color="primary"
            target="_blank"
            sx={{ mr: 2 }}
          >
            {t('Edit Keywords', { ns: 'common' })}
          </Button>
          <Button
            variant="contained"
            component={LinkDom}
            to={`${DEMO.CREATE_NEW_PROGRAM_ANALYSIS}`}
            target="_blank"
            color="primary"
          >
            {t('Create New Analysis', { ns: 'common' })}
          </Button>
        </Box>
      </Box>
      <Box>
        <Card sx={{ p: 2 }}>
          <Typography sx={{ pt: 1 }}>1. Please fill the courses.</Typography>
          <Typography>2. Select study group</Typography>
          <Typography sx={{ mb: 1 }}>
            3. Select language. <b>Chinese</b> is more accurate.
          </Typography>
          <DataSheetGrid
            height={1000}
            style={{ minWidth: '450px' }}
            disableContextMenu={true}
            disableExpandSelection={false}
            headerRowHeight={30}
            rowHeight={25}
            value={statedata.coursesdata}
            autoAddRow={true}
            onChange={onChange}
            columns={columns}
          />
          <br />
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChangeValue}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="basic tabs example"
            >
              <Tab label="Default" {...a11yProps(0)} />
              <Tab
                label={
                  <Badge badgeContent={'V2'} color="error">
                    New Analyzer
                  </Badge>
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <FormControl fullWidth>
              <InputLabel id="select-target-group">
                {t('Select Target Group', { ns: 'courses' })}
              </InputLabel>
              <Select
                labelId="study_group"
                label="Select target group"
                name="study_group"
                id="study_group"
                onChange={(e) => handleChange_study_group(e)}
              >
                <MenuItem value={''}>Select Study Group</MenuItem>
                {study_group.map((cat, i) => (
                  <MenuItem value={cat.key} key={i}>
                    {cat.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel id="select-language">
                {t('Select language', { ns: 'courses' })}
              </InputLabel>
              <Select
                labelId="analysis_language"
                label={t('Select language', { ns: 'courses' })}
                name="analysis_language"
                id="analysis_language"
                onChange={(e) => handleChange_analysis_language(e)}
              >
                <MenuItem value={''}>{t('Select language')}</MenuItem>
                <MenuItem value={'zh'}>中文</MenuItem>
                <MenuItem value={'en'}>English (Beta Version)</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <Button
              color="primary"
              variant="contained"
              onClick={onAnalyse}
              disabled={
                statedata.isAnalysing ||
                statedata.study_group === '' ||
                statedata.analysis_language === ''
              }
              endIcon={
                statedata.isAnalysing ? <CircularProgress size={24} /> : <></>
              }
            >
              {statedata.isAnalysing
                ? t('Analysing', { ns: 'courses' })
                : t('Analyse', { ns: 'courses' })}
            </Button>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ my: 1 }}
            >
              <Typography variant="h6"></Typography>
              <Box></Box>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ProgramRequirementsTable
                data={transformedData}
                onAnalyseV2={onAnalyseV2}
              />
            </LocalizationProvider>
          </CustomTabPanel>
          <Typography>
            {statedata.analysis && statedata.analysis.isAnalysed ? (
              <>
                <Button onClick={onDownload} disabled={statedata.isDownloading}>
                  {t('Download', { ns: 'common' })}
                </Button>
                <Link
                  to={`${DEMO.INTERNAL_WIDGET_LINK(user._id.toString())}`}
                  target="_blank"
                  component={LinkDom}
                >
                  {t('View Online', { ns: 'courses' })}
                </Link>
              </>
            ) : (
              t('No analysis yet', { ns: 'courses' })
            )}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
