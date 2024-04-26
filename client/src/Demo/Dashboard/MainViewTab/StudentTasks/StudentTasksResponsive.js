import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link, TableCell, TableRow } from '@mui/material';

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
  is_personal_data_filled,
  isProgramDecided,
  all_applications_results_updated
} from '../../../Utils/checking-functions';
import { appConfig } from '../../../../config';

function StudentTasksResponsive(props) {
  const { t } = useTranslation();
  let unread_general_generaldocs = <></>;
  let unread_applications_docthread = <></>;
  if (props.student.generaldocs_threads === undefined) {
    unread_general_generaldocs = <></>;
  } else {
    unread_general_generaldocs = props.student.generaldocs_threads.map(
      (generaldocs_threads, i) => (
        <TableRow key={i}>
          {!generaldocs_threads.isFinalVersion &&
            generaldocs_threads.latest_message_left_by_id !==
              props.student._id.toString() && (
              <>
                <TableCell>
                  <Link
                    underline="hover"
                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                      generaldocs_threads.doc_thread_id._id
                    )}
                    component={LinkDom}
                  >
                    {generaldocs_threads.doc_thread_id.file_type}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    underline="hover"
                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                      generaldocs_threads.doc_thread_id._id
                    )}
                    component={LinkDom}
                  >
                    My {generaldocs_threads.doc_thread_id.file_type}
                  </Link>
                </TableCell>
                <TableCell>
                  {' '}
                  {convertDate(generaldocs_threads.updatedAt)}
                </TableCell>
              </>
            )}
        </TableRow>
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
      (application) =>
        application.doc_modification_thread.map(
          (application_doc_thread, idx) => (
            <TableRow key={idx}>
              {!application_doc_thread.isFinalVersion &&
                application_doc_thread.latest_message_left_by_id !==
                  props.student._id.toString() &&
                isProgramDecided(application) && (
                  <>
                    <TableCell>
                      <Link
                        underline="hover"
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          application_doc_thread.doc_thread_id._id
                        )}
                        component={LinkDom}
                      >
                        {application_doc_thread.doc_thread_id.file_type}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        underline="hover"
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          application_doc_thread.doc_thread_id._id
                        )}
                        component={LinkDom}
                      >
                        {application.programId.school}
                        {' - '}
                        {application.programId.program_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {' '}
                      {convertDate(application_doc_thread.updatedAt)}
                    </TableCell>
                  </>
                )}
            </TableRow>
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
        <TableRow>
          <TableCell>
            <Link
              underline="hover"
              to={`${DEMO.SURVEY_LINK}`}
              component={LinkDom}
            >
              {t('Profile', { ns: 'common' })}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </TableCell>
          <TableCell>
            {t(
              'Please complete Profile so that your agent can understand your situation',
              { ns: 'dashboard' }
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {!props.isCoursesFilled &&
        (props.student.academic_background?.university?.isGraduated ===
          'pending' ||
          props.student.academic_background?.university?.isGraduated ===
            'Yes') && (
          <TableRow>
            <TableCell>
              <Link
                underline="hover"
                to={`${DEMO.COURSES_LINK}`}
                component={LinkDom}
              >
                {t('My Courses', { ns: 'common' })}
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </TableCell>
            <TableCell>
              {t(
                'Please complete My Courses table. The agent will provide you with course analysis and courses suggestion.',
                { ns: 'courses' }
              )}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      {!check_applications_to_decided(props.student) && (
        <TableRow>
          <TableCell>
            <Link
              underline="hover"
              to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
              component={LinkDom}
            >
              {t('My Applications', { ns: 'common' })}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </TableCell>
          <TableCell>
            {t(
              "Please refer to the programs provided by the agent and visit the school's program website for detailed information. Complete the school selection before the start of the application season.",
              { ns: 'courses' }
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {!all_applications_results_updated(props.student) && (
        <TableRow>
          <TableCell>
            <Link
              underline="hover"
              to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
              component={LinkDom}
            >
              {t('Application Results', { ns: 'common' })}
              <FiExternalLink style={{ cursor: 'pointer' }} />
            </Link>
          </TableCell>
          <TableCell>
            {t('Please update your applications results to us', {
              ns: 'common'
            })}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {/* check uni-assist */}
      {appConfig.vpdEnable &&
        !is_all_uni_assist_vpd_uploaded(props.student) && (
          <TableRow>
            <TableCell>
              <Link
                underline="hover"
                to={`${DEMO.UNI_ASSIST_LINK}`}
                component={LinkDom}
              >
                Uni-Assist
                <FiExternalLink
                  className="mx-1 mb-1"
                  style={{ cursor: 'pointer' }}
                />
              </Link>
            </TableCell>
            <TableCell>
              {t(
                'Please go to the Uni-Assist section, follow the instructions to complete',
                { ns: 'courses' }
              )}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      {!is_personal_data_filled(props.student) && (
        <TableRow>
          <TableCell>
            <Link underline="hover" to={`${DEMO.PROFILE}`} component={LinkDom}>
              {t('Personal Data', { ns: 'common' })}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </TableCell>
          <TableCell>
            {t(
              'Please be sure to update your Chinese and English names, as well as your date of birth information. This will affect the preparation of formal documents by the editor for you.',
              { ns: 'courses' }
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {are_base_documents_missing(props.student) && (
        <TableRow>
          <TableCell>
            <Link
              underline="hover"
              to={`${DEMO.BASE_DOCUMENTS_LINK}`}
              component={LinkDom}
            >
              {t('My Documents', { ns: 'common' })}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </TableCell>
          <TableCell>
            {t(
              'Please upload documents as soon as possible. The agent needs them to understand your academic background.',
              { ns: 'courses' }
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {to_register_application_portals(props.student) && (
        <TableRow>
          <TableCell>
            <Link
              underline="hover"
              to={`${DEMO.PORTALS_MANAGEMENT_LINK}`}
              component={LinkDom}
            >
              {t('Portals Management', { ns: 'common' })}
              <FiExternalLink
                className="mx-1 mb-1"
                style={{ cursor: 'pointer' }}
              />
            </Link>
          </TableCell>
          <TableCell>
            {t(
              "Please go to each school's website to create an account and provide your login credentials. This will facilitate the agent in conducting pre-submission checks for you in the future.",
              { ns: 'courses' }
            )}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
      {unread_general_generaldocs}
      {unread_applications_docthread}
    </>
  );
}

export default StudentTasksResponsive;
