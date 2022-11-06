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
import {
  check_academic_background_filled,
  check_application_preference_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded
} from '../../../Utils/checking-functions';
class AgentTasks extends React.Component {
  check_base_documents = (student) => {
    let documentlist2_keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < documentlist2_keys.length; i++) {
      object_init[documentlist2_keys[i]] = 'missing';
    }
    if (student.profile === undefined) {
      return false;
    }
    if (student.profile.length === 0) {
      return false;
    }
    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
        if (student.profile[i].status === 'uploaded') {
          object_init[student.profile[i].name] = 'uploaded';
        } else if (student.profile[i].status === 'accepted') {
          object_init[student.profile[i].name] = 'accepted';
        } else if (student.profile[i].status === 'rejected') {
          object_init[student.profile[i].name] = 'rejected';
        } else if (student.profile[i].status === 'missing') {
          object_init[student.profile[i].name] = 'missing';
        } else if (student.profile[i].status === 'notneeded') {
          object_init[student.profile[i].name] = 'notneeded';
        }
      }
    } else {
      return false;
    }
    for (let i = 0; i < documentlist2_keys.length; i++) {
      if (object_init[documentlist2_keys[i]] === 'uploaded') {
        return false;
      }
    }
    return true;
  };
  render() {
    let unread_general_generaldocs = <></>;
    let unread_applications_docthread = <></>;
    if (this.props.student.generaldocs_threads === undefined) {
      unread_general_generaldocs = <></>;
    } else {
      unread_general_generaldocs = this.props.student.generaldocs_threads.map(
        (generaldocs_threads, i) => (
          <tr key={i}>
            {!generaldocs_threads.isFinalVersion &&
              generaldocs_threads.latest_message_left_by_id !==
                this.props.student._id.toString() && (
                <>
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
                  <td>
                    <Link
                      to={
                        '/document-modification/' +
                        generaldocs_threads.doc_thread_id._id
                      }
                      className="text-info"
                      style={{ textDecoration: 'none' }}
                    >
                      My {generaldocs_threads.doc_thread_id.file_type}
                    </Link>
                  </td>
                  <td> {convertDate(generaldocs_threads.updatedAt)}</td>
                </>
              )}
          </tr>
        )
      );
    }

    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      unread_applications_docthread = <></>;
    } else {
      unread_applications_docthread = this.props.student.applications.map(
        (application, i) =>
          application.doc_modification_thread.map(
            (application_doc_thread, idx) => (
              <tr key={idx}>
                {!application_doc_thread.isFinalVersion &&
                  application_doc_thread.latest_message_left_by_id !==
                    this.props.student._id.toString() &&
                  application.decided === 'O' && (
                    <>
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
        {!check_applications_to_decided(this.props.student) && (
          <tr>
            <td>
              <Link
                to={'/student-applications'}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                My Applications
              </Link>
            </td>
            <td>Please decide YES or NO</td>
            <td></td>
          </tr>
        )}
        {/* check uni-assist */}
        {!is_all_uni_assist_vpd_uploaded(this.props.student) && (
          <tr>
            <td>
              <Link
                to={'/uni-assist'}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Uni-Assist
              </Link>
            </td>
            <td>Please Uni-Assist to apply and get VPD</td>
            <td></td>
          </tr>
        )}
        {!this.check_base_documents(this.props.student) && (
          <tr>
            <td>
              <Link
                to={
                  '/student-database/' +
                  this.props.student._id.toString() +
                  '/profile'
                }
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Base Documents
              </Link>
            </td>
            <td>
              {this.props.student.firstname}  {this.props.student.lastname} uploaded new files
            </td>
            <td></td>
          </tr>
        )}
        {unread_general_generaldocs}
        {unread_applications_docthread}
      </>
    );
  }
}

export default AgentTasks;
