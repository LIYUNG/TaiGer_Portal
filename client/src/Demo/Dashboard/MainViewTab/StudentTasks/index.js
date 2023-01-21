import React from 'react';
import { Link } from 'react-router-dom';

import DEMO from '../../../../store/constant';
import { convertDate } from '../../../Utils/contants';
import {
  check_academic_background_filled,
  check_application_preference_filled,
  check_languages_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded,
  are_base_documents_missing
} from '../../../Utils/checking-functions';

class StudentTasks extends React.Component {
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
        {(!check_academic_background_filled(
          this.props.student.academic_background
        ) ||
          !check_application_preference_filled(
            this.props.student.application_preference
          ) ||
          !check_languages_filled(this.props.student.academic_background)) && (
          <tr>
            <td>
              <Link
                to={`${DEMO.SURVEY_LINK}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Survey
              </Link>
            </td>
            <td>It looks like you did not finish survey</td>
            <td></td>
          </tr>
        )}
        {!check_applications_to_decided(this.props.student) && (
          <tr>
            <td>
              <Link
                to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
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
                to={`${DEMO.UNI_ASSIST_LINK}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Uni-Assist
              </Link>
            </td>
            <td>Please go to Uni-Assist to apply and get VPD</td>
            <td></td>
          </tr>
        )}
        {this.props.student.birthday === '' && (
          <tr>
            <td>
              <Link
                to={`${DEMO.SETTINGS}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Personal Data
              </Link>
            </td>
            <td>Please go to Personal Data to fill your birthday.</td>
            <td></td>
          </tr>
        )}
        {are_base_documents_missing(this.props.student) && (
          <tr>
            <td>
              <Link
                to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Base Documents
              </Link>
            </td>
            <td>Some of Base Documents are still missing</td>
            <td></td>
          </tr>
        )}
        {unread_general_generaldocs}
        {unread_applications_docthread}
      </>
    );
  }
}

export default StudentTasks;
