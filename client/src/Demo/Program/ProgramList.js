import React, { useState, useEffect } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import ProgramListSubpage from './ProgramListSubpage';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getPrograms, assignProgramToStudent, createProgram } from '../../api';
// A great library for fuzzy filtering/sorting items
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramListSingleStudentAssignSubpage from './ProgramListSingleStudentAssignSubpage';
import NewProgramEdit from './NewProgramEdit';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import ModalNew from '../../components/Modal';

function ProgramList(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  let [tableStates, setTableStates] = useState({
    success: false,
    isloaded: false,
    isAssigning: false,
    isButtonDisable: false,
    error: null,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false,
    res_modal_status: 0,
    res_modal_message: ''
  });
  let [statedata, setStatedata] = useState({
    success: false,
    programs: null,
    isloaded: false,
    res_modal_status: 0,
    error: '',
    res_status: 0
  });
  const [filters, setFilters] = useState({});
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  let [programs, setPrograms] = useState({
    programIds: [],
    schools: [],
    program_names: [],
    degree: [],
    semester: []
  });
  let [studentId, setStudentId] = useState('');
  let [isCreationMode, setIsCreationMode] = useState(false);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(t('Program List', { ns: 'common' }));
  useEffect(() => {
    getPrograms().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: data,
            isloaded: true,
            res_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isloaded: true,
            res_status: status
          }));
        }
      },
      (error) =>
        setStatedata((state) => ({
          ...state,
          error,
          isloaded: true
        }))
    );
  }, []);

  useEffect(() => {
    const data_idxes = rowSelectionModel;
    setPrograms({
      programIds: data_idxes.map(
        (idx) => statedata.programs.find((program) => program?._id === idx)?._id
      ),
      schools: data_idxes.map(
        (idx) =>
          statedata.programs.find((program) => program?._id === idx)?.school
      ),
      program_names: data_idxes.map(
        (idx) =>
          statedata.programs.find((program) => program?._id === idx)
            ?.program_name
      ),
      degree: data_idxes.map(
        (idx) =>
          statedata.programs.find((program) => program?._id === idx)?.degree
      ),
      semester: data_idxes.map(
        (idx) =>
          statedata.programs.find((program) => program?._id === idx)?.semester
      )
    });
  }, [rowSelectionModel]);

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
      window.location.reload(true);
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
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let new_program_list = [...statedata.programs, data];
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: new_program_list,
            isloaded: true,
            res_modal_status: status
          }));
          setIsCreationMode(!isCreationMode);
        } else {
          const { message } = resp.data;
          setStatedata((state) => ({
            ...state,
            isloaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) =>
        setStatedata((state) => ({
          ...state,
          error,
          isloaded: true
        }))
    );
  };

  const ConfirmError = () => {
    setTableStates((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
    setStatedata((state) => ({
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

  const c2 = [
    {
      field: 'school',
      headerName: t('School'),
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
    { field: 'country', headerName: t('Country'), width: 90 },
    { field: 'degree', headerName: t('Degree', { ns: 'common' }), width: 90 },
    { field: 'semester', headerName: t('Semester', { ns: 'common' }), width: 100 },
    { field: 'lang', headerName: t('Language'), width: 120 },
    { field: 'toefl', headerName: t('TOEFL'), width: 100 },
    { field: 'ielts', headerName: t('IELTS'), width: 100 },
    { field: 'gre', headerName: t('GRE'), width: 120 },
    { field: 'gmat', headerName: t('GMAT'), width: 120 },
    { field: 'application_deadline', headerName: t('Deadline', { ns: 'common' }), width: 120 },
    { field: 'updatedAt', headerName: t('Last updated'), width: 150 }
  ];

  if (!statedata.isloaded && !statedata.programs) {
    return <Loading />;
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
  };

  const transformedData = statedata.programs.map((row) => {
    return {
      ...row, // Spread the original row object
      id: row._id // Map MongoDB _id to id property
      // other properties...
    };
  });
  const filteredRows = transformedData.filter((row) => {
    return Object.keys(filters).every((field) => {
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
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
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
            programs={statedata.programs}
          />
        </>
      ) : (
        <>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onClickIsCreateApplicationMode}
          >
            {t('Add New Program')}
          </Button>
          {rowSelectionModel.length > 0 && (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={setModalShow2}
              startIcon={<PersonAddIcon />}
            ></Button>
          )}
          <br />
          <div style={{ height: '50%', width: '100%' }}>
            <DataGrid
              columnHeaderHeight={130}
              density="compact"
              rows={filteredRows}
              disableColumnFilter
              disableColumnMenu
              disableDensitySelector
              columns={c2.map((column) => ({
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
                      onClick={stopPropagation} // value={filterText[params.field] || ''}
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
          {props.isStudentApplicationPage ? (
            <ProgramListSingleStudentAssignSubpage
              student={props.student}
              show={tableStates.modalShowAssignWindow}
              assignProgram={assignProgram}
              setModalHide={setModalHide}
              setStudentId={setStudentId}
              uni_name={programs.schools}
              program_name={programs.program_names}
              degree={programs.degree}
              semester={programs.semester}
              handleChange2={handleSetStudentId}
              isButtonDisable={tableStates.isButtonDisable}
              onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
            />
          ) : (
            <ProgramListSubpage
              show={tableStates.modalShowAssignWindow}
              setModalHide={setModalHide}
              uni_name={programs.schools}
              program_name={programs.program_names}
              handleSetStudentId={handleSetStudentId}
              isButtonDisable={tableStates.isButtonDisable}
              studentId={studentId}
              onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
            />
          )}
        </>
      )}
      <ModalNew
        open={tableStates.modalShowAssignSuccessWindow}
        onHide={onHideAssignSuccessWindow}
        size="m"
        centered
      >
        <Typography>{t('Success', { ns: 'common' })}</Typography>
        <Typography>
          {t('Program(s) assigned to student successfully!')}
        </Typography>
        <Typography>
          <Button variant="outlined" onClick={onHideAssignSuccessWindow}>
            {t('Close', { ns: 'common' })}
          </Button>
        </Typography>
      </ModalNew>
    </Box>
  );
}

export default ProgramList;
