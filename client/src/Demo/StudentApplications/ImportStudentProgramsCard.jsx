import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EmailIcon from '@mui/icons-material/Email';
import { highlightText } from '../Utils/checking-functions';
import ModalNew from '../../components/Modal';
import {
  assignProgramToStudent,
  getQueryStudentsResults,
  getStudentApplications
} from '../../api';

export const ImportStudentProgramsCard = (props) => {
  const { t } = useTranslation();
  const [importStudentProgramsCard, setImportStudentProgramsCardState] =
    useState({
      error: '',
      student: props.student,
      isLoaded: true,
      importedStudent: '',
      importedStudentPrograms: [],
      program_ids: [],
      importedStudentModalOpen: false,
      isButtonDisable: false,
      isImportingStudentPrograms: false,
      modalShowAssignSuccessWindow: false,
      student_id: null,
      program_id: null,
      success: false,
      application_status_changed: false,
      modalDeleteApplication: false,
      modalUpdatedApplication: false,
      showProgramCorrectnessReminderModal: true,
      isProgramAssignMode: false,
      searchResults: [],
      isResultsVisible: false,
      res_status: 0,
      res_modal_status: 0,
      res_modal_message: ''
    });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (importStudentProgramsCard.searchTerm) {
        fetchSearchResults();
      } else {
        setImportStudentProgramsCardState((prevState) => ({
          ...prevState,
          searchResults: []
        }));
      }
    }, 300); // Adjust the delay as needed
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [importStudentProgramsCard.searchTerm]);

  const handleClickOutside = () => {
    // Clicked outside, hide the result list
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      isResultsVisible: false
    }));
  };

  const onClickStudentHandler = (result) => {
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      importedStudentModalOpen: true,
      isImportingStudentPrograms: true
    }));
    // Call api:
    getStudentApplications(result._id.toString()).then(
      (res) => {
        const { data, success } = res.data;
        const { status } = res;
        if (success) {
          setImportStudentProgramsCardState((prevState) => ({
            ...prevState,
            isImportingStudentPrograms: false,
            importedStudentPrograms: data,
            program_ids: data?.map((program) =>
              program.programId._id.toString()
            ),
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setImportStudentProgramsCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      () => {}
    );
  };

  const fetchSearchResults = async () => {
    try {
      setImportStudentProgramsCardState((prevState) => ({
        ...prevState,
        isLoading: true
      }));
      const response = await getQueryStudentsResults(
        importStudentProgramsCard.searchTerm
      );
      if (response.data.success) {
        setImportStudentProgramsCardState((prevState) => ({
          ...prevState,
          searchResults: response.data.data,
          isResultsVisible: true,
          isLoading: false
        }));
      } else {
        setImportStudentProgramsCardState((prevState) => ({
          ...prevState,
          isResultsVisible: false,
          searchTerm: '',
          searchResults: [],
          isErrorTerm: true,
          isLoading: false,
          res_modal_status: 401,
          res_modal_message: 'Session expired. Please refresh.'
        }));
      }
    } catch (error) {
      setImportStudentProgramsCardState((prevState) => ({
        ...prevState,
        isResultsVisible: false,
        searchTerm: '',
        searchResults: [],
        isErrorTerm: true,
        isLoading: false,
        res_modal_status: 403,
        res_modal_message: error
      }));
    }
  };

  const onHideimportedStudentModalOpen = () => {
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      importedStudentModalOpen: false,
      importedStudentPrograms: []
    }));
  };

  const handleInputBlur = () => {
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      isResultsVisible: false
    }));
  };

  const handleInputChange = (e) => {
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      searchTerm: e.target.value.trimLeft()
    }));
    if (e.target.value.length === 0) {
      setImportStudentProgramsCardState((prevState) => ({
        ...prevState,
        isResultsVisible: false
      }));
    }
  };

  const onHideAssignSuccessWindow = () => {
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      modalShowAssignSuccessWindow: false
    }));
    window.location.reload(true);
  };

  const modifyImportingPrograms = (new_programId, isActive) => {
    let importing_program_ids_existing = [
      ...importStudentProgramsCard.program_ids
    ];
    console.log(importing_program_ids_existing);
    if (isActive) {
      importing_program_ids_existing = importing_program_ids_existing.filter(
        (item) => item !== new_programId
      );
      setImportStudentProgramsCardState((prevState) => ({
        ...prevState,
        program_ids: importing_program_ids_existing
      }));
    } else {
      importing_program_ids_existing.push(new_programId);
      setImportStudentProgramsCardState((prevState) => ({
        ...prevState,
        program_ids: importing_program_ids_existing
      }));
    }
  };

  const handleImportProgramsConfirm = () => {
    const program_ids = importStudentProgramsCard.program_ids;
    setImportStudentProgramsCardState((prevState) => ({
      ...prevState,
      isButtonDisable: true
    }));
    assignProgramToStudent(
      importStudentProgramsCard.student._id.toString(),
      program_ids
    ).then(
      (res) => {
        const { success } = res.data;
        const { status } = res;
        if (success) {
          setImportStudentProgramsCardState((prevState) => ({
            ...prevState,
            isButtonDisable: false,
            importedStudentModalOpen: false,
            modalShowAssignSuccessWindow: true,
            success,
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setImportStudentProgramsCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            importedStudentModalOpen: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      () => {}
    );
  };
  return (
    <>
      <Card sx={{ p: 2, minHeight: '340px', zIndex: 0 }}>
        <Typography>{t('Import programs from another student')}</Typography>
        <Typography>
          {t('Find the student (name or email) and import his/her progams')}
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            size="small"
            className="search-input"
            placeholder={t('Search student...')}
            value={importStudentProgramsCard.searchTerm}
            onMouseDown={handleInputBlur}
            onChange={handleInputChange}
          />
          {importStudentProgramsCard.isResultsVisible &&
            (importStudentProgramsCard.searchResults?.length > 0 ? (
              <Paper
                sx={{
                  marginTop: '5px',
                  position: 'absolute',
                  zIndex: 2,
                  left: 0,
                  right: 0,
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}
              >
                <List>
                  {importStudentProgramsCard.searchResults?.map((result, i) => (
                    <ListItem
                      onClick={() => onClickStudentHandler(result)}
                      key={i}
                      button
                    >
                      <ListItemText
                        primary={
                          <>
                            {highlightText(
                              `${result.firstname} ${result.lastname} ${
                                result.firstname_chinese || ''
                              } ${result.lastname_chinese || ''}`,
                              importStudentProgramsCard.searchTerm
                            )}
                            {result.email && (
                              <Box
                                component="span"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  ml: 1
                                }}
                              >
                                <EmailIcon sx={{ mr: 0.5 }} />
                                {highlightText(
                                  result.email,
                                  importStudentProgramsCard.searchTerm
                                )}
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Paper
                sx={{
                  marginTop: '5px',
                  position: 'absolute',
                  zIndex: 2,
                  left: 0,
                  right: 0
                }}
              >
                <List>
                  <ListItem button>
                    <ListItemText primary={'No result'} />
                  </ListItem>
                </List>
              </Paper>
            ))}
        </Box>
      </Card>
      <ModalNew
        open={importStudentProgramsCard.importedStudentModalOpen}
        onClose={onHideimportedStudentModalOpen}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Import programs</Typography>
        <Typography>
          Do you want to import the following programs?
          <br />
          (Same programs will <b>NOT</b> be duplicated :) )
          {importStudentProgramsCard.isImportingStudentPrograms ? (
            <CircularProgress size={16} />
          ) : (
            <List>
              {importStudentProgramsCard.importedStudentPrograms?.map(
                (app, i) => (
                  <ListItemButton
                    key={i}
                    role={undefined}
                    onClick={() =>
                      modifyImportingPrograms(
                        app.programId._id.toString(),
                        importStudentProgramsCard.program_ids?.some(
                          (program_id) =>
                            program_id === app.programId._id.toString()
                        )
                      )
                    }
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={importStudentProgramsCard.program_ids?.some(
                          (program_id) =>
                            program_id === app.programId._id.toString()
                        )}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${app.programId?.school} - ${app.programId?.program_name} ${app.programId?.degree} ${app.programId?.semester}`}
                    />
                  </ListItemButton>
                )
              ) || []}
            </List>
          )}
        </Typography>
        <Typography>
          <Button
            color="primary"
            variant="contained"
            size="small"
            disabled={importStudentProgramsCard.isButtonDisable}
            onClick={handleImportProgramsConfirm}
          >
            {importStudentProgramsCard.isButtonDisable ? (
              <CircularProgress size={16} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={onHideimportedStudentModalOpen}
          >
            {t('No', { ns: 'common' })}
          </Button>
        </Typography>
      </ModalNew>
      <ModalNew
        open={importStudentProgramsCard.modalShowAssignSuccessWindow}
        onClose={onHideAssignSuccessWindow}
        size="m"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography id="contained-modal-title-vcenter">
          {t('Success', { ns: 'common' })}
        </Typography>
        <Typography>Program(s) imported to student successfully!</Typography>
        <Typography>
          <Button onClick={onHideAssignSuccessWindow}>Close</Button>
        </Typography>
      </ModalNew>
    </>
  );
};
