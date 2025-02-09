import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

const ProgramConflict = ({ students, program }) => {
    return (
        <TableBody>
            <TableRow>
                <TableCell rowSpan={(students?.length || 0) + 1}>
                    <div>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.SINGLE_PROGRAM_LINK(program?._id)}`}
                        >
                            <b>{program?.school}</b>
                        </Link>
                    </div>
                    <div>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.SINGLE_PROGRAM_LINK(program?._id)}`}
                        >
                            {program?.program_name}
                        </Link>
                    </div>
                </TableCell>
            </TableRow>
            {students?.map((student, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                student.studentId,
                                DEMO.PROFILE_HASH
                            )}`}
                        >
                            {student.firstname}, {student.lastname}
                        </Link>
                    </TableCell>
                    <TableCell>
                        {student?.application_preference
                            ?.expected_application_date
                            ? student.application_preference
                                  .expected_application_date + '-'
                            : ''}
                        {program.application_deadline}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default ProgramConflict;
