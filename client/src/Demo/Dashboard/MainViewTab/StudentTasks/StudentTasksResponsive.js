import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

import DEMO from '../../../../store/constant';
import { convertDate } from '../../../Utils/contants';
import {
  check_academic_background_filled,
  check_application_preference_filled,
  check_languages_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded,
  are_base_documents_missing,
  to_register_application_portals,
  is_personal_data_filled
} from '../../../Utils/checking-functions';

class StudentTasksResponsive extends React.Component {
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
                My Survey
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>請完成問卷，您的Agent才能了解您的狀況</td>
            <td></td>
          </tr>
        )}
        {!this.props.isCoursesFilled &&
          (this.props.student.academic_background?.university?.isGraduated ===
            'pending' ||
            this.props.student.academic_background?.university?.isGraduated ===
              'Yes') && (
            <tr>
              <td>
                <Link
                  to={`${DEMO.COURSES_LINK}`}
                  style={{ textDecoration: 'none' }}
                  className="text-info"
                >
                  My Courses
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
              </td>
              <td>請完成大學修課表，Agent將會為您提供課程分析以及修課建議</td>
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
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>
              請參考Agent提供的Program，並到學校學程網站了解詳細資訊，於申請季開始前完成選校
            </td>
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
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>請至 Uni-Assist 專區，依照指示完成帳號申請，上傳文件，申請 VPD</td>
            <td></td>
          </tr>
        )}
        {!is_personal_data_filled(this.props.student) && (
          <tr>
            <td>
              <Link
                to={`${DEMO.PROFILE}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Personal Data
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>
              請務必更新你中英文姓名、生日資料。這會影響Editor為您正式文件準備。
            </td>
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
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>請盡速上傳各類成績單和證書等的文件。Agent才能了解你學術背景</td>
            <td></td>
          </tr>
        )}
        {to_register_application_portals(this.props.student) && (
          <tr>
            <td>
              <Link
                to={`${DEMO.PORTALS_MANAGEMENT_LINK}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Portals Management
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>
              請到各學校網站辦理帳號並提供您的帳號密碼，方便Agent日後為您做送出前檢查
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

export default StudentTasksResponsive;
