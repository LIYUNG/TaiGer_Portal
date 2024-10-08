import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow } from '@mui/material';

import {
  does_student_have_agents,
  does_student_have_editors,
  does_essay_have_writers,
  is_num_Program_Not_specified
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useTranslation } from 'react-i18next';

function AdminTasks(props) {
  const { t } = useTranslation();
  const missing_number_of_applications_students = props.students.map(
    (student, i) =>
      is_num_Program_Not_specified(student) && (
        <TableRow key={i}>
          <TableCell>
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                student._id.toString()
              )}`}
              component={LinkDom}
            >
              Number of Applications{' '}
              <b>
                {student.firstname} {student.lastname}
              </b>
            </Link>
          </TableCell>
          <TableCell>
            Please specify the number of the application for{' '}
            <b>
              {student.firstname} {student.lastname}
            </b>
          </TableCell>
        </TableRow>
      )
  );

  return (
    <>
      {!does_student_have_agents(props.students) && (
        <TableRow>
          <TableCell>
            <Link to={`${DEMO.ASSIGN_AGENT_LINK}`} component={LinkDom}>
              {t('Assign Agents')}
            </Link>
          </TableCell>
          <TableCell>{t('Please assign agents', { ns: 'common' })}</TableCell>
        </TableRow>
      )}
      {!does_student_have_editors(props.students) && (
        <TableRow>
          <TableCell>
            <Link to={`${DEMO.ASSIGN_EDITOR_LINK}`} component={LinkDom}>
              {t('Assign Editors')}
            </Link>
          </TableCell>
          <TableCell>{t('Please assign editors', { ns: 'common' })}</TableCell>
        </TableRow>
      )}
      {!does_essay_have_writers(
        props.essayDocumentThreads.filter((thread) => !thread.isFinalVersion)
      ) && (
        <TableRow>
          <TableCell>
            <Link to={`${DEMO.ASSIGN_ESSAY_WRITER_LINK}`} component={LinkDom}>
              {t('Assign Essay Writer', { ns: 'common' })}
            </Link>
          </TableCell>
          <TableCell>
            {t('Please assign essay writers', { ns: 'common' })}
          </TableCell>
        </TableRow>
      )}
      {/* assign number of application according to contract */}
      {missing_number_of_applications_students}
    </>
  );
}

export default AdminTasks;
