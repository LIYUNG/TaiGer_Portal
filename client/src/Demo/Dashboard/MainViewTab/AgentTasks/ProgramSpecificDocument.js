import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow } from '@mui/material';

import { has_agent_program_specific_tasks } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function ProgramSpecificDocument(props) {
  return (
    <>
      {/* check if documents needed to be checked by Agent (Supplementary form, Curriculum Analysis) */}
      {has_agent_program_specific_tasks(props.student) &&
        props.student.applications.map((application) =>
          application.doc_modification_thread.map(
            (thread) =>
              !thread.isFinalVersion &&
              ['Supplementary_Form', 'Curriculum_Analysis', 'Others'].includes(
                thread.doc_thread_id?.file_type
              ) && (
                <TableRow key={thread._id}>
                  <TableCell>
                    <Link
                      to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                        props.student._id.toString(),
                        DEMO.APPLICATION_HASH
                      )}`}
                      component={LinkDom}
                    >
                      {props.student.firstname} {props.student.lastname}{' '}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {props.student.application_preference
                      ?.expected_application_date || (
                      <span className="text-danger">TBD</span>
                    )}
                    {'/'}
                    {props.student.application_preference
                      ?.expected_application_semester || (
                      <span className="text-danger">TBD</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={DEMO.DOCUMENT_MODIFICATION_LINK(
                        thread.doc_thread_id._id
                      )}
                      component={LinkDom}
                      target="_blank"
                    >
                      {application.programId.school}
                      {'-'}
                      {application.programId.program_name}
                      {'-'}
                      {thread.doc_thread_id?.file_type}
                    </Link>
                  </TableCell>
                </TableRow>
              )
          )
        )}
    </>
  );
}

export default ProgramSpecificDocument;
