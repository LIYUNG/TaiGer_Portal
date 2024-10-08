import React from 'react';
import { Link } from 'react-router-dom';

import DEMO from '../../../../store/constant';
import { convertDate } from '../../../Utils/contants';
import {
  application_deadline_calculator,
  GetCVDeadline,
  is_TaiGer_Guest,
  is_TaiGer_Student
} from '../../../Utils/checking-functions';
import { useAuth } from '../../../../App/layout/AuthProvider';

function UnrespondedThreads(props) {
  const { user } = useAuth();
  var unread_general_generaldocs = 0;
  var unread_applications_docthread = 0;
  const { CVDeadline, daysLeftMin } = GetCVDeadline(props.student);

  if (
    props.student.applications === undefined ||
    props.student.applications.length === 0
  ) {
    unread_general_generaldocs = <></>;
    unread_applications_docthread = <></>;
  } else {
    unread_general_generaldocs = props.student.generaldocs_threads.map(
      (generaldocs_threads, i) => (
        <tr key={i}>
          {!generaldocs_threads.isFinalVersion &&
            generaldocs_threads.latest_message_left_by_id !==
              user._id.toString() &&
            generaldocs_threads.latest_message_left_by_id !== '' && (
              <>
                <td>
                  <Link
                    to={
                      is_TaiGer_Student(user) || is_TaiGer_Guest(user)
                        ? `${DEMO.CV_ML_RL_CENTER_LINK}`
                        : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                            props.student._id,
                            DEMO.CVMLRL_HASH
                          )}`
                    }
                    className="text-info"
                    style={{ textDecoration: 'none' }}
                  >
                    {props.student.firstname}
                    {' - '}
                    {props.student.lastname}
                  </Link>
                </td>
                <td>
                  <Link
                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                      generaldocs_threads.doc_thread_id._id
                    )}
                    className="text-info"
                    style={{ textDecoration: 'none' }}
                  >
                    {generaldocs_threads.doc_thread_id.file_type}
                  </Link>
                </td>
                <td>{CVDeadline}</td>
                <td> {convertDate(generaldocs_threads.updatedAt)}</td>
              </>
            )}
        </tr>
      )
    );

    unread_applications_docthread = props.student.applications.map(
      (application, i) =>
        application.doc_modification_thread.map(
          (application_doc_thread, idx) => (
            <tr key={i * 20 + idx}>
              {!application_doc_thread.isFinalVersion &&
                application_doc_thread.latest_message_left_by_id !==
                  user._id.toString() &&
                application_doc_thread.latest_message_left_by_id !== '' && (
                  <>
                    <td>
                      <Link
                        to={
                          is_TaiGer_Student(user) || is_TaiGer_Guest(user)
                            ? `${DEMO.CV_ML_RL_CENTER_LINK}`
                            : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                props.student._id,
                                DEMO.CVMLRL_HASH
                              )}`
                        }
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {props.student.firstname}
                        {' - '}
                        {props.student.lastname}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          application_doc_thread.doc_thread_id._id
                        )}
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {application_doc_thread.doc_thread_id.file_type}
                        {' - '}
                        {application.programId.school}
                        {' - '}
                        {application.programId.program_name}
                      </Link>
                    </td>
                    <td>
                      {application_deadline_calculator(
                        props.student,
                        application
                      )}
                    </td>
                    <td> {convertDate(application_doc_thread.updatedAt)}</td>
                  </>
                )}
            </tr>
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
}

export default UnrespondedThreads;
