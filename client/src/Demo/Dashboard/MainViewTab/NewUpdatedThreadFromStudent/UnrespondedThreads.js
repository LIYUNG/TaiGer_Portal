import React from 'react';
import { Link } from 'react-router-dom';
import DEMO from '../../../../store/constant';

import { convertDate, getNumberOfDays } from '../../../Utils/contants';
import { application_deadline_calculator } from '../../../Utils/checking-functions';

class UnrespondedThreads extends React.Component {
  render() {
    var today = new Date();
    var unread_general_generaldocs = 0;
    var unread_applications_docthread = 0;
    let days_left_min = 3000;
    let CV_deadline = '';
    for (let i = 0; i < this.props.student.applications.length; i += 1) {
      let application_deadline_temp = application_deadline_calculator(
        this.props.student,
        this.props.student.applications[i]
      );
      let day_left = getNumberOfDays(today, application_deadline_temp);
      if (days_left_min > day_left) {
        days_left_min = day_left;
        CV_deadline = application_deadline_temp;
      }
    }
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
                        this.props.role === 'Student' ||
                        this.props.role === 'Guest'
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
                  <td>{CV_deadline}</td>
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
                            this.props.role === 'Student' ||
                            this.props.role === 'Guest'
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
