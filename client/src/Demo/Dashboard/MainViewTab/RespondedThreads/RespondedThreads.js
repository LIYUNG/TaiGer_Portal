import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow } from '@mui/material';
import { isProgramDecided } from '@taiger-common/core';

import DEMO from '../../../../store/constant';
import { convertDate } from '../../../../utils/contants';

const RespondedThreads = (props) => {
    var unread_general_generaldocs;
    var unread_applications_docthread;

    if (
        props.student.applications === undefined ||
        props.student.applications.length === 0
    ) {
        unread_general_generaldocs = null;
        unread_applications_docthread = null;
    } else {
        unread_general_generaldocs = props.student.generaldocs_threads.map(
            (generaldocs_threads, i) => (
                <TableRow key={i}>
                    {!generaldocs_threads.isFinalVersion &&
                    generaldocs_threads.latest_message_left_by_id ===
                        props.student._id.toString() ? (
                        <>
                            <TableCell>
                                <Link
                                    component={LinkDom}
                                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                        generaldocs_threads.doc_thread_id._id
                                    )}
                                    underline="hover"
                                >
                                    {
                                        generaldocs_threads.doc_thread_id
                                            .file_type
                                    }
                                </Link>
                            </TableCell>
                            <TableCell>
                                {' '}
                                {convertDate(generaldocs_threads.updatedAt)}
                            </TableCell>
                        </>
                    ) : null}
                </TableRow>
            )
        );

        unread_applications_docthread = props.student.applications.map(
            (application) =>
                application.doc_modification_thread.map(
                    (application_doc_thread, idx) => (
                        <TableRow key={idx}>
                            {!application_doc_thread.isFinalVersion &&
                            application_doc_thread.latest_message_left_by_id ===
                                props.student._id.toString() &&
                            isProgramDecided(application) ? (
                                <>
                                    <TableCell>
                                        <Link
                                            component={LinkDom}
                                            to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                                application_doc_thread
                                                    .doc_thread_id._id
                                            )}
                                            underline="hover"
                                        >
                                            {
                                                application_doc_thread
                                                    .doc_thread_id.file_type
                                            }
                                            {' - '}
                                            {application.programId.school}
                                            {' - '}
                                            {application.programId.program_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {convertDate(
                                            application_doc_thread.updatedAt
                                        )}
                                    </TableCell>
                                </>
                            ) : null}
                        </TableRow>
                    )
                )
        );
    }

    return (
        <>
            {unread_general_generaldocs}
            {unread_applications_docthread}
        </>
    );
};

export default RespondedThreads;
