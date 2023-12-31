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
import DEMO from '../../../../store/constant';

class CVMLRLProgress extends React.Component {
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
                      to={DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                        this.props.student._id,
                        '/CV_ML_RL'
                      )}
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
                      to={DEMO.DOCUMENT_MODIFICATION_LINK(
                        generaldocs_thread.doc_thread_id._id
                      )}
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
                          to={DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                            this.props.student._id,
                            '/CV_ML_RL'
                          )}
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
                          to={DEMO.DOCUMENT_MODIFICATION_LINK(
                            doc_thread.doc_thread_id._id
                          )}
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

export default CVMLRLProgress;
