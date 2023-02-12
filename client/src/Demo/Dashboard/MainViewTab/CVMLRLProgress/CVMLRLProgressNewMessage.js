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

class CVMLRLProgressNewMessage extends React.Component {
  handleAsFinalFileThread = (
    thread_id,
    student_id,
    program_id,
    documenName,
    isFinalVersion
  ) => {
    this.props.handleAsFinalFile(
      thread_id,
      student_id,
      program_id,
      documenName,
      isFinalVersion
    );
  };
  render() {
    var today = new Date();
    let general_document_items = <></>;
    let application_document_items = <></>;
    const { CV_deadline, days_left_min } = GetCVDeadline(this.props.student);

    general_document_items =
      this.props.student.generaldocs_threads &&
      this.props.student.generaldocs_threads.map(
        (generaldocs_thread, i) =>
          is_new_message_status(this.props.user, generaldocs_thread) && (
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
                      <p className="text-light">
                        <b>
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}
                        </b>
                      </p>
                    </Link>
                  </td>
                  {is_TaiGer_role(this.props.user) &&
                    (generaldocs_thread.isFinalVersion ? (
                      <td>
                        <AiOutlineUndo
                          size={24}
                          color="red"
                          title="Un do Final Version"
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            this.handleAsFinalFileThread(
                              generaldocs_thread.doc_thread_id._id,
                              this.props.student._id,
                              null,
                              generaldocs_thread.doc_thread_id.file_type,
                              generaldocs_thread.isFinalVersion
                            )
                          }
                        />
                      </td>
                    ) : (
                      <td>
                        <AiOutlineCheck
                          size={24}
                          style={{ cursor: 'pointer' }}
                          title="Set as final version"
                          onClick={() =>
                            this.handleAsFinalFileThread(
                              generaldocs_thread.doc_thread_id._id,
                              this.props.student._id,
                              null,
                              generaldocs_thread.doc_thread_id.file_type,
                              generaldocs_thread.isFinalVersion
                            )
                          }
                        />
                      </td>
                    ))}
                  {return_thread_status(this.props.user, generaldocs_thread)}
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
                  <td>{CV_deadline}</td>
                  <td>{days_left_min}</td>
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
            is_new_message_status(this.props.user, doc_thread) && (
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
                          <p className="text-light">
                            <b>
                              {this.props.student.firstname}{' '}
                              {this.props.student.lastname}
                            </b>
                          </p>
                        </Link>
                      </td>

                      {is_TaiGer_role(this.props.user) &&
                        (doc_thread.isFinalVersion ? (
                          <td>
                            <AiOutlineUndo
                              size={24}
                              color="red"
                              title="Un do Final Version"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                this.handleAsFinalFileThread(
                                  doc_thread.doc_thread_id._id,
                                  this.props.student._id,
                                  application.programId._id,
                                  doc_thread.doc_thread_id.file_type,
                                  doc_thread.isFinalVersion
                                )
                              }
                            />
                          </td>
                        ) : (
                          <td>
                            <AiOutlineCheck
                              size={24}
                              style={{ cursor: 'pointer' }}
                              title="Set as final version"
                              onClick={() =>
                                this.handleAsFinalFileThread(
                                  doc_thread.doc_thread_id._id,
                                  this.props.student._id,
                                  application.programId._id,
                                  doc_thread.doc_thread_id.file_type,
                                  doc_thread.isFinalVersion
                                )
                              }
                            />
                          </td>
                        ))}
                      {return_thread_status(this.props.user, doc_thread)}
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
                        {application.closed === 'O'
                          ? '-'
                          : application.programId.application_deadline
                          ? this.props.student.application_preference &&
                            this.props.student.application_preference
                              .expected_application_date &&
                            getNumberOfDays(
                              today,
                              application_deadline_calculator(
                                this.props.student,
                                application
                              )
                            )
                          : '-'}
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

export default CVMLRLProgressNewMessage;
