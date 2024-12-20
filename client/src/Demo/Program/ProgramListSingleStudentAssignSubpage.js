import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';

import { useTranslation } from 'react-i18next';

function ProgramListSingleStudentAssignSubpage(props) {
  const { t } = useTranslation();
  const [
    ProgramListSingleStudentAssignSubpageState,
    setProgramListSingleStudentAssignSubpageState
  ] = useState({
    uni_name: props.uni_name,
    program_name: props.program_name,
    degree: props.degree,
    semester: props.semester
  });

  useEffect(() => {
    props.setStudentId(props.student._id.toString());
  }, []);

  useEffect(() => {
    setProgramListSingleStudentAssignSubpageState((prevState) => ({
      ...prevState,
      uni_name: props.uni_name,
      program_name: props.program_name,
      degree: props.degree,
      semester: props.semester
    }));
  }, [props.show]);

  let program_names = [];
  for (
    let i = 0;
    i < ProgramListSingleStudentAssignSubpageState.uni_name.length;
    i++
  ) {
    program_names.push(
      `${ProgramListSingleStudentAssignSubpageState.uni_name[i]}-${ProgramListSingleStudentAssignSubpageState.program_name[i]}-${ProgramListSingleStudentAssignSubpageState.degree[i]}-${ProgramListSingleStudentAssignSubpageState.semester[i]}`
    );
  }
  return (
    <Dialog
      open={props.show}
      onClose={props.setModalHide}
      size="small"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle>
        Assign{' '}
        {program_names.map((program_name, i) => (
          <Typography key={i}>
            <b>{program_name}</b>
          </Typography>
        ))}
        to the student:
      </DialogTitle>
      <DialogContent>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>{`${props.student.firstname} ${props.student.lastname}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={props.isButtonDisable}
          onClick={(e) => props.onSubmitAddToStudentProgramList(e)}
        >
          {props.isButtonDisable ? (
            <CircularProgress />
          ) : (
            t('Assign', { ns: 'common' })
          )}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={props.setModalHide}
        >
          {t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProgramListSingleStudentAssignSubpage;
