import React from 'react';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineUndo
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { convertDate } from '../../../Utils/contants';

class EditorTODOTasks extends React.Component {
  render() {
    var unread_general_generaldocs;
    var unread_applications_docthread;

    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      unread_general_generaldocs = <></>;
      unread_applications_docthread = <></>;
    } else {
      unread_general_generaldocs = this.props.student.generaldocs_threads.map(
        (generaldocs_threads, i) => (
          <>
            {!generaldocs_threads.isFinalVersion && (
              <tr>
                <td>
                  <Link
                    to={
                      '/student-database/' +
                      this.props.student._id +
                      '/application-files'
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
                <td></td>
                <td>
                  {new Date(generaldocs_threads.updatedAt).toLocaleDateString()}
                  {', '}
                  {new Date(generaldocs_threads.updatedAt).toLocaleTimeString()}
                </td>
              </tr>
            )}
          </>
        )
      );

      unread_applications_docthread = this.props.student.applications.map(
        (application, i) =>
          application.doc_modification_thread.map(
            (application_doc_thread, idx) => (
              <>
                <tr>
                  <td>
                    <Link
                      to={
                        '/student-database/' +
                        this.props.student._id +
                        '/application-files'
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
                  <td>{application.programId.application_deadline}</td>
                  <td>{convertDate(application_doc_thread.updatedAt)}</td>
                </tr>
              </>
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