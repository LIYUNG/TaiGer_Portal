import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Link,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Typography
} from '@mui/material';

import {
  areProgramsDecidedMoreThanContract,
  is_num_Program_Not_specified
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

const NoEnoughDecidedProgramsTasks = (props) => {
  const { t } = useTranslation();
  return (
    <>
      {is_num_Program_Not_specified(props.student) ? (
        <TableRow>
          <TableCell>
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                props.student._id.toString()
              )}`}
              component={LinkDom}
            >
              <b>
                {props.student.firstname} {props.student.lastname}{' '}
              </b>
              {t('Applications')}
            </Link>
          </TableCell>
          <TableCell>
            Contact Sales or Admin for the number of program of
            <b>
              {props.student.firstname} {props.student.lastname}
            </b>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      ) : (
        <>
          {/* select enough program task */}
          {!areProgramsDecidedMoreThanContract(props.student) && (
            <TableRow>
              <TableCell>
                <Link
                  to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                    props.student._id.toString()
                  )}`}
                  component={LinkDom}
                >
                  <b>
                    {' '}
                    {props.student.firstname} {props.student.lastname}{' '}
                  </b>
                  Applications
                </Link>
              </TableCell>
              <TableCell>
                {t('Please select enough programs for')}{' '}
                <b>
                  {props.student.firstname} {props.student.lastname}
                </b>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </>
      )}
      {/* TODO: add Portal register tasks */}
    </>
  );
};

function NoEnoughDecidedProgramsTasksCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const no_enough_programs_decided_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <NoEnoughDecidedProgramsTasks
        key={i}
        role={user.role}
        student={student}
      />
    ));
  return (
    <Card sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography>{t('No Enough Program Decided Tasks')}:</Typography>
      </Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tasks</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Last Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{no_enough_programs_decided_tasks}</TableBody>
      </Table>
    </Card>
  );
}

export default NoEnoughDecidedProgramsTasksCard;
