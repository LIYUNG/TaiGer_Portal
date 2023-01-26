import React from 'react';
import { Link } from 'react-router-dom';

import {
  convertDate,
  return_thread_status,
  getNumberOfDays
} from '../../../Utils/contants';
import { application_deadline_calculator } from '../../../Utils/checking-functions';

class EditorTODOTasks extends React.Component {
  render() {
    var today = new Date();
    var unread_general_generaldocs;
    var unread_applications_docthread;
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
            {!generaldocs_threads.isFinalVersion && (
              <>
                <td>
                  <Link
                    to={
                      '/student-database/' +
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
                {return_thread_status(this.props.user, generaldocs_threads)}
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
                <td>
                  {new Date(generaldocs_threads.updatedAt).toLocaleDateString()}
                  {', '}
                  {new Date(generaldocs_threads.updatedAt).toLocaleTimeString()}
                </td>
              </>
            )}
          </tr>
        )
      );

      unread_applications_docthread = this.props.student.applications.map(
        (application, i) =>
          application.doc_modification_thread.map(
            (application_doc_thread, idx) => (
              <tr key={idx}>
                {!application_doc_thread.isFinalVersion &&
                  application.decided === 'O' &&
                  application_deadline_calculator(
                    this.props.student,
                    application
                  ) !== 'CLOSE' && (
                    <>
                      <td>
                        <Link
                          to={
                            '/student-database/' +
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
                      {return_thread_status(
                        this.props.user,
                        application_doc_thread
                      )}
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
                      <td>{convertDate(application_doc_thread.updatedAt)}</td>
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

export default EditorTODOTasks;
