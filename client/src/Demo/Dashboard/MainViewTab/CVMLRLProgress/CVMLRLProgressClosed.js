import React from 'react';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { IoCheckmarkCircle } from 'react-icons/io5';
import { convertDate } from '../../../Utils/contants';
import {
  AiFillQuestionCircle,
  AiOutlineCheck,
  AiOutlineUndo
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
import { BiCommentDots } from 'react-icons/bi';
class CVMLRLProgressClosed extends React.Component {
  handleAsFinalFileThread = (
    thread_id,
    student_id,
    program_id,
    documenName
  ) => {
    this.props.handleAsFinalFile(
      thread_id,
      student_id,
      program_id,
      documenName
    );
  };
  render() {
    var today = new Date();
    const return_thread_status = (user, thread) => {
      if (thread.isFinalVersion) {
        return (
          <td className="mb-1 text-info">
            <IoCheckmarkCircle size={24} color="limegreen" title="Complete" />
          </td>
        );
      }
      if (
        thread.latest_message_left_by_id === undefined ||
        thread.latest_message_left_by_id === ''
      ) {
        if (user.role !== 'Student') {
          return (
            <td className="mb-1 text-info">
              <AiFillQuestionCircle
                size={24}
                color="lightgray"
                title="Waiting feedback"
              />
            </td>
          );
        }
      }
      if (user._id.toString() === thread.latest_message_left_by_id) {
        return (
          <td className="mb-1 text-info">
            <AiFillQuestionCircle
              size={24}
              color="lightgray"
              title="Waiting feedback"
            />
          </td>
        );
      } else {
        return (
          <td className="mb-1 text-info">
            <BiCommentDots size={24} color="red" title="New Message" />
          </td>
        );
      }
    };

    let general_document_items = <></>;
    // TODO: implement:
    let no_started_general_document_items = <></>;
    let application_document_items = <></>;
    // TODO: implement:
    let no_started_application_document_items = <></>;
    general_document_items =
      this.props.student.generaldocs_threads &&
      this.props.student.generaldocs_threads.map((generaldocs_thread, i) => (
        <tr key={i}>
          {generaldocs_thread.isFinalVersion && (
            <>
              <td></td>
              <td>
                <Link
                  to={
                    '/student-database/' + this.props.student._id + '/CV_ML_RL'
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
              {(this.props.role === 'Admin' ||
                this.props.role === 'Editor' ||
                this.props.role === 'Agent') &&
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
                          generaldocs_thread.doc_thread_id.file_type
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
                          generaldocs_thread.doc_thread_id.file_type
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
              <td></td>
              <td></td>
            </>
          )}
        </tr>
      ));
    application_document_items =
      this.props.student.applications &&
      this.props.student.applications.map((application, i) =>
        application.doc_modification_thread.map((doc_thread, j) => (
          <tr key={j}>
            {application.decided === 'O' && doc_thread.isFinalVersion && (
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

                {(this.props.role === 'Admin' ||
                  this.props.role === 'Editor' ||
                  this.props.role === 'Agent') &&
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
                            doc_thread.doc_thread_id.file_type
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
                            doc_thread.doc_thread_id.file_type
                          )
                        }
                      />
                    </td>
                  ))}

                {return_thread_status(this.props.user, doc_thread)}
                <td>
                  <Link
                    to={
                      '/document-modification/' + doc_thread.doc_thread_id._id
                    }
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    {doc_thread.doc_thread_id.file_type}
                    {' - '}
                    {application.programId.school}
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
                  {this.props.student.application_preference &&
                    this.props.student.application_preference
                      .expected_application_date &&
                    this.props.student.application_preference
                      .expected_application_date + '-'}
                  {application.programId.application_deadline}
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
                        this.props.student.application_preference
                          .expected_application_date +
                          '-' +
                          application.programId.application_deadline
                      )
                    : '-'}
                </td>
              </>
            )}
          </tr>
        ))
      );
    return (
      <>
        {no_started_general_document_items}
        {no_started_application_document_items}
        {general_document_items}
        {application_document_items}
      </>
    );
  }
}

export default CVMLRLProgressClosed;