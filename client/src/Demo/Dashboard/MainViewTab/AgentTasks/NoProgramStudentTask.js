import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow } from '@mui/material';

import { hasApplications } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

const NoProgramStudentTask = (props) => {
    return (
        <>
            {/* check if no program selected */}
            {!hasApplications(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                props.student._id.toString(),
                                DEMO.APPLICATION_HASH
                            )}`}
                        >
                            {props.student.firstname} {props.student.lastname}
                        </Link>
                    </TableCell>
                    <TableCell>
                        {' '}
                        {props.student.application_preference
                            ?.expected_application_date || (
                            <span className="text-danger">TBD</span>
                        )}
                        /
                        {props.student.application_preference
                            ?.expected_application_semester || (
                            <span className="text-danger">TBD</span>
                        )}
                    </TableCell>
                </TableRow>
            ) : null}
        </>
    );
};

export default NoProgramStudentTask;
