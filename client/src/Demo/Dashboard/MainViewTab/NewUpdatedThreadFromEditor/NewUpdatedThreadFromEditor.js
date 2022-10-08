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

class NewUpdatedThreadFromEditor extends React.Component {
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
          <tr key={i}>
            {!generaldocs_threads.isFinalVersion &&
              !generaldocs_threads.StudentRead && (
                <>
                  <td>
                    <Link
                      to={
                        this.props.role === 'Student' ||
                        this.props.role === 'Guest'
                          ? '/cv-ml-rl-center'
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
              <tr key={idx}>
                {!application_doc_thread.isFinalVersion &&
                  !application_doc_thread.StudentRead && (
                    <>
                      <td>
                        <Link
                          to={
                            this.props.role === 'Student' ||
                            this.props.role === 'Guest'
                              ? '/cv-ml-rl-center'
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
                        {' '}
                        {new Date(
                          application_doc_thread.updatedAt
                        ).toLocaleDateString()}
                        {', '}
                        {new Date(
                          application_doc_thread.updatedAt
                        ).toLocaleTimeString()}
                      </td>
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

export default NewUpdatedThreadFromEditor;
