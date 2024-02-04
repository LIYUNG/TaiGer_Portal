import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { getStudents } from '../../api';
import ModalNew from '../../components/Modal';
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
    <ModalNew
      open={props.show}
      onClose={props.setModalHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      {t('Assign')}{' '}
      {program_names.map((program_name, i) => (
        <Typography variant="body1" fontWeight="bold" key={i}>
          {program_name}
        </Typography>
      ))}
      <Typography variant="body1">{t('to the student')}:</Typography>
      <Table size="small">
        <TableBody>
          {programListSubpageState.students.map((student, i) => (
            <TableRow key={i}>
              <TableCell>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    name="student_id"
                    value={student._id}
                    id={student._id}
                    onChange={props.handleSetStudentId}
                  />
                </Form.Group>
              </TableCell>
              <TableCell>
                {student.firstname}, {student.lastname}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        disabled={props.isButtonDisable}
        onClick={(e) => props.onSubmitAddToStudentProgramList(e)}
      >
        {props.isButtonDisable ? <CircularProgress /> : t('Assign')}
      </Button>
      <Button variant="outlined" onClick={props.setModalHide}>
        {t('Cancel')}
      </Button>
    </ModalNew>
  );
}
export default ProgramListSubpage;
