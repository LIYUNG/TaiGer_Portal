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

class UnrespondedThreads extends React.Component {
  render() {
    var today = new Date();
    var unread_general_generaldocs = 0;
    var unread_applications_docthread = 0;
    const { CVDeadline, daysLeftMin } = GetCVDeadline(this.props.student);

    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      unread_general_generaldocs = <></>;
      unread_applications_docthread = <></>;
    } else {
      unread_general_generaldocs = this.props.student.generaldocs_threads.map(
        (generaldocs_threads, i) => (
          <tr key={i}>
            {!generaldocs_threads.isFinalVersion &&
              generaldocs_threads.latest_message_left_by_id !==
                this.props.user._id.toString() && (
                <>
                  <td>
                    <Link
                      to={
                        is_TaiGer_Student(this.props.user) ||
                        is_TaiGer_Guest(this.props.user)
                          ? `${DEMO.CV_ML_RL_CENTER_LINK}`
                          : '/student-database/' +
                            this.props.student._id +
                            '/CV_ML_RL'
                      }
                      className="text-info"
                      style={{ textDecoration: 'none' }}
                    >
                      {this.props.student.firstname}
                      {' - '}
                      {this.props.student.lastname}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={
                        '/document-modification/' +
                        generaldocs_threads.doc_thread_id._id
                      }
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

      unread_applications_docthread = this.props.student.applications.map(
        (application, i) =>
          application.doc_modification_thread.map(
            (application_doc_thread, idx) => (
              <tr key={i * 20 + idx}>
                {!application_doc_thread.isFinalVersion &&
                  application_doc_thread.latest_message_left_by_id !==
                    this.props.user._id.toString() &&
                  application_doc_thread.latest_message_left_by_id !== '' && (
                    <>
                      <td>
                        <Link
                          to={
                            is_TaiGer_Student(this.props.user) ||
                            is_TaiGer_Guest(this.props.user)
                              ? `${DEMO.CV_ML_RL_CENTER_LINK}`
                              : '/student-database/' +
                                this.props.student._id +
                                '/CV_ML_RL'
                          }
                          className="text-info"
                          style={{ textDecoration: 'none' }}
                        >
                          {this.props.student.firstname}
                          {' - '}
                          {this.props.student.lastname}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={
                            '/document-modification/' +
                            application_doc_thread.doc_thread_id._id
                          }
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
                          this.props.student,
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
}

export default UnrespondedThreads;
