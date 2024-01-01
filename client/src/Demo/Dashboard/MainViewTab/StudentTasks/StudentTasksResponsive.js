import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

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
import { appConfig } from '../../../../config';

function StudentTasksResponsive(props) {
  const { t, i18n } = useTranslation();
  let unread_general_generaldocs = <></>;
  let unread_applications_docthread = <></>;
  if (props.student.generaldocs_threads === undefined) {
    unread_general_generaldocs = <></>;
  } else {
    unread_general_generaldocs = props.student.generaldocs_threads.map(
      (generaldocs_threads, i) => (
        <tr key={i}>
          {!generaldocs_threads.isFinalVersion &&
            generaldocs_threads.latest_message_left_by_id !==
              props.student._id.toString() && (
              <>
                <td>
                  <Link
                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                      generaldocs_threads.doc_thread_id._id
                    )}
                    className="text-info"
                    style={{ textDecoration: 'none' }}
                  >
                    {generaldocs_threads.doc_thread_id.file_type}
                  </Link>
                </td>
                <td>
                  <Link
                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                      generaldocs_threads.doc_thread_id._id
                    )}
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
    props.student.applications === undefined ||
    props.student.applications.length === 0
  ) {
    unread_applications_docthread = <></>;
  } else {
    unread_applications_docthread = props.student.applications.map(
      (application, i) =>
        application.doc_modification_thread.map(
          (application_doc_thread, idx) => (
            <tr key={idx}>
              {!application_doc_thread.isFinalVersion &&
                application_doc_thread.latest_message_left_by_id !==
                  props.student._id.toString() &&
                application.decided === 'O' && (
                  <>
                    <td>
                      <Link
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          application_doc_thread.doc_thread_id._id
                        )}
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {application_doc_thread.doc_thread_id.file_type}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          application_doc_thread.doc_thread_id._id
                        )}
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
      {(!check_academic_background_filled(props.student.academic_background) ||
        !check_application_preference_filled(
          props.student.application_preference
        ) ||
        !check_languages_filled(props.student.academic_background)) && (
        <tr>
          <td>
            <Link
              to={`${DEMO.SURVEY_LINK}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {t('My Survey')}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </td>
          <td>
            {t(
              'Please complete My Survey so that your agent can understand your situation'
            )}
          </td>
          <td></td>
        </tr>
      )}
      {!props.isCoursesFilled &&
        (props.student.academic_background?.university?.isGraduated ===
          'pending' ||
          props.student.academic_background?.university?.isGraduated ===
            'Yes') && (
          <tr>
            <td>
              <Link
                to={`${DEMO.COURSES_LINK}`}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                {t('My Courses')}
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </td>
            <td>
              {t(
                'Please complete My Courses table. The agent will provide you with course analysis and courses suggestion.'
              )}
            </td>
            <td></td>
          </tr>
        )}
      {!check_applications_to_decided(props.student) && (
        <tr>
          <td>
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {t('My Applications')}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </td>
          <td>
            {t(
              "Please refer to the programs provided by the agent and visit the school's program website for detailed information. Complete the school selection before the start of the application season."
            )}
          </td>
          <td></td>
        </tr>
      )}
      {/* check uni-assist */}
      {appConfig.vpdEnable &&
        !is_all_uni_assist_vpd_uploaded(props.student) && (
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
            <td>
              {t(
                'Please go to the Uni-Assist section, follow the instructions to complete'
              )}
            </td>
            <td></td>
          </tr>
        )}
      {!is_personal_data_filled(props.student) && (
        <tr>
          <td>
            <Link
              to={`${DEMO.PROFILE}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {t('Personal Data')}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </td>
          <td>
            {t(
              'Please be sure to update your Chinese and English names, as well as your date of birth information. This will affect the preparation of formal documents by the editor for you.'
            )}
          </td>
          <td></td>
        </tr>
      )}
      {are_base_documents_missing(props.student) && (
        <tr>
          <td>
            <Link
              to={`${DEMO.BASE_DOCUMENTS_LINK}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {t('My Documents')}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </td>
          <td>
            {t(
              'Please upload documents as soon as possible. The agent needs them to understand your academic background.'
            )}
          </td>
          <td></td>
        </tr>
      )}
      {to_register_application_portals(props.student) && (
        <tr>
          <td>
            <Link
              to={`${DEMO.PORTALS_MANAGEMENT_LINK}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {t('Portals Management')}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </td>
          <td>
            {t(
              "Please go to each school's website to create an account and provide your login credentials. This will facilitate the agent in conducting pre-submission checks for you in the future."
            )}
          </td>
          <td></td>
        </tr>
      )}
      {unread_general_generaldocs}
      {unread_applications_docthread}
    </>
  );
}

export default StudentTasksResponsive;
