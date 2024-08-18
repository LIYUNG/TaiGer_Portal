import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { getStudents } from '../../api';
import { useTranslation } from 'react-i18next';

function ProgramListSubpage(props) {
  const { t } = useTranslation();
  const [programListSubpageState, setProgramListSubpageState] = useState({
    error: '',
    students: [],
    isLoaded: false,
    timeouterror: null,
    unauthorizederror: null,
    res_status: 0
  });

  useEffect(() => {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setProgramListSubpageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success,
            res_status: status
          }));
        } else {
          setProgramListSubpageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setProgramListSubpageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const { res_status, isLoaded } = programListSubpageState;

  if (!isLoaded && !programListSubpageState.students) {
    return <CircularProgress />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  let program_names = [];
  for (let i = 0; i < props.uni_name.length; i++) {
    program_names.push(props.uni_name[i] + ' - ' + props.program_name[i]);
  }
  return (
    <Dialog
      open={props.show}
      onClose={props.setModalHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle>
        {t('Assign', { ns: 'common' })}
        {program_names.map((program_name, i) => (
          <Typography variant="body1" fontWeight="bold" key={i}>
            {program_name}
          </Typography>
        ))}
        {t('to the student', { ns: 'programList' })}:
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1"></Typography>
        <Table size="small">
          <TableBody>
            {programListSubpageState.students.map((student, i) => (
              <TableRow key={i}>
                <TableCell>
                  <FormControlLabel
                    label={`${student.firstname}, ${student.lastname}`}
                    control={
                      <Checkbox
                        checked={props.studentId === student._id}
                        onChange={props.handleSetStudentId}
                        value={student._id}
                      />
                    }
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={props.isButtonDisable}
          onClick={(e) => props.onSubmitAddToStudentProgramList(e)}
        >
          {props.isButtonDisable ? (
            <CircularProgress />
          ) : (
            t('Assign', { ns: 'common' })
          )}
        </Button>
        <Button variant="outlined" onClick={props.setModalHide}>
          {t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ProgramListSubpage;
