import React, { useState } from 'react';
import { Link as LinkDom, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

// import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { assignProgramToStudent, createProgram } from '../../api';
// A great library for fuzzy filtering/sorting items
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramListSingleStudentAssignSubpage from './ProgramListSingleStudentAssignSubpage';
import NewProgramEdit from './NewProgramEdit';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { getProgramsQuery } from '../../api/query';
import { ProgramsTable } from './ProgramsTable';

function ProgramList(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(getProgramsQuery());
  const programs = data?.data?.data;
  let [tableStates, setTableStates] = useState({
    success: false,
    isAssigning: false,
    isButtonDisable: false,
    error: null,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const [filters, setFilters] = useState({});
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  let [studentId, setStudentId] = useState('');
  let [isCreationMode, setIsCreationMode] = useState(false);

  TabTitle(t('Program List', { ns: 'common' }));

  // useEffect(() => {
  //   const parsed = queryString.parse(location.search);
  //   console.log(parsed);
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     parsed
  //   }));
  // }, []);

  //  const parseQueryParams = () => {
  //    const searchParams = new URLSearchParams(window.location.search);
  //    const params = {};

  //    // Iterate through each query parameter
  //    for (const [key, value] of searchParams.entries()) {
  //      // Add key-value pair to params object
  //      params[key] = value;
  //    }

  //    // Set state with parsed query parameters
  //    setFilters(params);
  //  };
  //  parseQueryParams();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    setTableStates((state) => ({
      ...state,
      isAssigning: true,
      isButtonDisable: true
    }));
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setTableStates((state) => ({
            ...state,
            isLoaded: true,
            isAssigning: false,
            isButtonDisable: false,
            modalShowAssignSuccessWindow: true,
            modalShowAssignWindow: false,
            success,
            res_modal_status: status
          }));
          setRowSelectionModel([]);
        } else {
          const { message } = resp.data;
          setTableStates((state) => ({
            ...state,
            isLoaded: true,
            isAssigning: false,
            isButtonDisable: false,
            modalShowAssignWindow: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setTableStates((state) => ({
          ...state,
          isLoaded: true,
          isAssigning: false,
          isButtonDisable: false,
          error,
          res_modal_status: 500,
          res_modal_message: 'Server error'
        }));
      }
    );
  };
  const setModalHide = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignWindow: false
    }));
  };
  const onHideAssignSuccessWindow = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignSuccessWindow: false
    }));
    if (props.isStudentApplicationPage) {
      navigate(DEMO.STUDENT_APPLICATIONS_ID_LINK(studentId));
    }
  };

  const onSubmitAddToStudentProgramList = (e) => {
    e.preventDefault();
    const student_id = studentId;
    assignProgram({ student_id, program_ids: rowSelectionModel });
  };

  const handleSetStudentId = (e) => {
    const { value } = e.target;
    setStudentId(value);
  };

  const onClickIsCreateApplicationMode = () => {
    setIsCreationMode(!isCreationMode);
  };

  const handleSubmit_Program = (program) => {
    createProgram(program).then(
      () => {},
      () => {}
    );
  };

  const ConfirmError = () => {
    setTableStates((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const setModalShow2 = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignWindow: true
    }));
  };

  const programListColumn = [
    {
      field: 'school',
      headerName: t('School', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'program_name',
      headerName: t('Program', { ns: 'common' }),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    { field: 'country', headerName: t('Country', { ns: 'common' }), width: 90 },
    { field: 'degree', headerName: t('Degree', { ns: 'common' }), width: 90 },
    {
      field: 'semester',
      headerName: t('Semester', { ns: 'common' }),
      width: 100
    },
    { field: 'lang', headerName: t('Language', { ns: 'common' }), width: 120 },
    { field: 'toefl', headerName: t('TOEFL', { ns: 'common' }), width: 100 },
    { field: 'ielts', headerName: t('IELTS', { ns: 'common' }), width: 100 },
    { field: 'gre', headerName: t('GRE', { ns: 'common' }), width: 120 },
    { field: 'gmat', headerName: t('GMAT', { ns: 'common' }), width: 120 },
    {
      field: 'application_deadline',
      headerName: t('Deadline', { ns: 'common' }),
      width: 120
    },
    {
      field: 'updatedAt',
      headerName: t('Last update', { ns: 'common' }),
      width: 150
    }
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <>{error}</>;
  }

  const handleFilterChange = (event, column) => {
    event.preventDefault();
    const { value } = event.target;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(column.field, value.toLowerCase());
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
    if (!props.isStudentApplicationPage) {
      navigate(`${window.location.pathname}?${searchParams.toString()}`);
    }
  };

  const transformedData = programs.map((row) => {
    return {
      ...row, // Spread the original row object
      id: row._id // Map MongoDB _id to id property
      // other properties...
    };
  });
  const filteredRows = transformedData.filter((row) => {
    const parsed = queryString.parse(location.search);
    return Object.keys(parsed).every((field) => {
      const filterValue = filters[field];
      return (
        filterValue === '' ||
        row[field]?.toString().toLowerCase().includes(filterValue)
      );
    });
  });

  const stopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Box>
      {tableStates.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={tableStates.res_modal_status}
          res_modal_message={tableStates.res_modal_message}
        />
      )}

      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">
          {t('Program List', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      {isCreationMode ? (
        <>
          <NewProgramEdit
            handleClick={onClickIsCreateApplicationMode}
            handleSubmit_Program={handleSubmit_Program}
            programs={programs}
            isSubmitting={false}
            type={'create'}
          />
        </>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 1 }}
          >
            <Typography variant="h6">
              {t('Program List', { ns: 'common' })}
            </Typography>
            {/* Button on the right */}
            <Box>
              <Button
                color="success"
                variant="contained"
                onClick={setModalShow2}
                disabled={!rowSelectionModel.length > 0}
                startIcon={<PersonAddIcon />}
                sx={{ mr: 1 }}
              >
                {t('Assign', { ns: 'common' })}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={LinkDom}
                to={DEMO.PROGRAM_ANALYSIS}
                sx={{ mr: 1 }}
              >
                {t('Program Requirements', { ns: 'common' })}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={LinkDom}
                to={DEMO.SCHOOL_CONFIG}
                sx={{ mr: 1 }}
              >
                {t('School Configuration', { ns: 'common' })}
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={onClickIsCreateApplicationMode}
              >
                {t('Add New Program')}
              </Button>
            </Box>
          </Box>
          <ProgramsTable isLoading={isLoading} data={transformedData} />
          <div style={{ height: '50%', width: '100%' }}>
            <DataGrid
              columnHeaderHeight={130}
              density="compact"
              rows={filteredRows}
              disableColumnFilter
              disableColumnMenu
              disableDensitySelector
              columns={programListColumn.map((column) => ({
                ...column,
                renderHeader: () => (
                  <Box>
                    <Typography
                      sx={{ my: 1 }}
                    >{`${column.headerName}`}</Typography>
                    <TextField
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
              keepNonExistentRowsSelected
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              pageSizeOptions={[10, 20, 50, 100]}
              checkboxSelection
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
                }
              }}
            />
          </div>
          {props.isStudentApplicationPage && (
            <ProgramListSingleStudentAssignSubpage
              student={props.student}
              show={tableStates.modalShowAssignWindow}
              assignProgram={assignProgram}
              setModalHide={setModalHide}
              setStudentId={setStudentId}
              // uni_name={assigningPrograms.schools}
              // program_name={assigningPrograms.program_names}
              // degree={assigningPrograms.degree}
              // semester={assigningPrograms.semester}
              handleChange2={handleSetStudentId}
              isButtonDisable={tableStates.isButtonDisable}
              onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
            />
          )}
        </>
      )}
      <Dialog
        open={tableStates.modalShowAssignSuccessWindow}
        onHide={onHideAssignSuccessWindow}
        size="m"
        centered
      >
        <DialogTitle>{t('Success', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          {t('Program(s) assigned to student successfully!', {
            ns: 'programList'
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onHideAssignSuccessWindow}>
            {t('Close', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProgramList;
