import React from 'react';
import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import {
  is_TaiGer_role,
  application_deadline_calculator,
  GetCVDeadline
} from '../../../Utils/checking-functions';

import { convertDate, is_new_message_status } from '../../../Utils/contants';
import { getNumberOfDays, return_thread_status } from '../../../Utils/contants';

class TaskManagement extends React.Component {
  render() {
    var today = new Date();
    let general_document_items = <></>;
    let application_document_items = <></>;
    const { CVDeadline, daysLeftMin } = GetCVDeadline(this.props.student);

    general_document_items =
      this.props.student.generaldocs_threads &&
      this.props.student.generaldocs_threads.map(
        (generaldocs_thread, i) =>
          this.props.showTasks(this.props.user, generaldocs_thread) && (
            <tr key={i}>
              {!generaldocs_thread.isFinalVersion && (
                <>
                  <td></td>
                  <td>
                    <Link
                      to={
                        '/student-database/' +
                        this.props.student._id +
                        '/CV_ML_RL'
                      }
                      style={{ textDecoration: 'none' }}
                    >
                      <p className="text-light my-0">
                        <b>
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}
                        </b>
                      </p>
                    </Link>
                  </td>
                  <td>
                    {this.props.student.editors &&
                    this.props.student.editors.length > 0 ? (
                      this.props.student.editors.map((editor, i) => (
                        <Link to={`/teams/editors/${editor._id.toString()}`}>
                          <p className="text-light my-0">
                            <b>{`${editor.firstname} ${editor.lastname}`}</b>
                          </p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-danger my-0">
                        <b>No Editor</b>
                      </p>
                    )}
                  </td>
                  <td>
                    <Link
                      to={
                        '/document-modification/' +
                        generaldocs_thread.doc_thread_id._id
                      }
                      style={{ textDecoration: 'none' }}
                      className="text-info"
                    >
                      {generaldocs_thread.doc_thread_id.file_type}
                    </Link>
                  </td>
                  <td>{convertDate(generaldocs_thread.updatedAt)}</td>
                  <td>
                    {!generaldocs_thread.isFinalVersion &&
                      getNumberOfDays(generaldocs_thread.updatedAt, today)}
                  </td>
                  <td>{CVDeadline}</td>
                  <td>
                    <p
                      className={`text-${
                        daysLeftMin > 30 ? 'light' : 'danger'
                      } my-0`}
                    >
                      {daysLeftMin}
                    </p>
                  </td>
                </>
              )}
            </tr>
          )
      );
    application_document_items =
      this.props.student.applications &&
      this.props.student.applications.map((application, i) =>
        application.doc_modification_thread.map(
          (doc_thread, j) =>
            this.props.showTasks(this.props.user, doc_thread) && (
              <tr key={j}>
                {application.decided === 'O' &&
                  !doc_thread.isFinalVersion &&
                  application.closed !== 'O' && (
                    <>
                      <td></td>
                      <td>
                        <Link
                          to={
                            '/student-database/' +
                            this.props.student._id +
                            '/CV_ML_RL'
                          }
                          style={{ textDecoration: 'none' }}
                        >
                          <p className="text-light my-0">
                            <b>
                              {this.props.student.firstname}{' '}
                              {this.props.student.lastname}
                            </b>
                          </p>
                        </Link>
                      </td>
                      <td>
                        {' '}
                        {this.props.student.editors &&
                        this.props.student.editors.length > 0 ? (
                          this.props.student.editors.map((editor, i) => (
                            <Link
                              to={`/teams/editors/${editor._id.toString()}`}
                            >
                              <p className="text-light my-0">
                                <b>{`${editor.firstname} ${editor.lastname}`}</b>
                              </p>
                            </Link>
                          ))
                        ) : (
                          <p className="text-danger my-0">
                            <b>No Editor</b>
                          </p>
                        )}
                      </td>
                      <td>
                        <Link
                          to={
                            '/document-modification/' +
                            doc_thread.doc_thread_id._id
                          }
                          style={{ textDecoration: 'none' }}
                          className="text-info"
                        >
                          {doc_thread.doc_thread_id.file_type}
                          {' - '}
                          {application.programId.school}
                          {' - '}
                          {application.programId.degree}
                          {' - '}
                          {application.programId.program_name}
                        </Link>
                      </td>
                      <td>{convertDate(doc_thread.updatedAt)}</td>
                      <td>
                        {!doc_thread.isFinalVersion &&
                          getNumberOfDays(doc_thread.updatedAt, today)}
                      </td>
                      <td>
                        {application_deadline_calculator(
                          this.props.student,
                          application
                        )}
                      </td>
                      <td>
                        {application.programId.application_deadline ? (
                          <p
                            className={`text-${
                              parseInt(
                                getNumberOfDays(
                                  today,
                                  application_deadline_calculator(
                                    this.props.student,
                                    application
                                  )
                                )
                              ) > 30
                                ? 'light'
                                : 'danger'
                            } my-0`}
                          >
                            {getNumberOfDays(
                              today,
                              application_deadline_calculator(
                                this.props.student,
                                application
                              )
                            )}
                          </p>
                        ) : (
                          '-'
                        )}
                      </td>
                    </>
                  )}
              </tr>
            )
        )
      );
    return (
      <>
        {general_document_items}
        {application_document_items}
      </>
    );
  }
}

export default TaskManagement;
