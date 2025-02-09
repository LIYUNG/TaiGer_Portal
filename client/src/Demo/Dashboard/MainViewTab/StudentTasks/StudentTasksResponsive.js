import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link, TableCell, TableRow, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { isProgramDecided } from '@taiger-common/core';

import DEMO from '../../../../store/constant';
import { convertDate } from '../../../../utils/contants';
import {
    check_academic_background_filled,
    check_application_preference_filled,
    check_languages_filled,
    check_applications_to_decided,
    is_all_uni_assist_vpd_uploaded,
    are_base_documents_missing,
    to_register_application_portals,
    is_personal_data_filled,
    all_applications_results_updated,
    has_admissions
} from '../../../Utils/checking-functions';
import { appConfig } from '../../../../config';

const StudentTasksResponsive = (props) => {
    const { t } = useTranslation();
    let unread_general_generaldocs = null;
    let unread_applications_docthread = null;
    if (props.student.generaldocs_threads === undefined) {
        unread_general_generaldocs = null;
    } else {
        unread_general_generaldocs = props.student.generaldocs_threads.map(
            (generaldocs_threads, i) => (
                <TableRow key={i}>
                    {!generaldocs_threads.isFinalVersion &&
                    generaldocs_threads.latest_message_left_by_id !==
                        props.student._id.toString() ? (
                        <>
                            <TableCell>
                                <Link
                                    component={LinkDom}
                                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                        generaldocs_threads.doc_thread_id._id
                                    )}
                                    underline="hover"
                                >
                                    {
                                        generaldocs_threads.doc_thread_id
                                            .file_type
                                    }
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link
                                    component={LinkDom}
                                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                        generaldocs_threads.doc_thread_id._id
                                    )}
                                    underline="hover"
                                >
                                    My{' '}
                                    {
                                        generaldocs_threads.doc_thread_id
                                            .file_type
                                    }
                                </Link>
                            </TableCell>
                            <TableCell>
                                {' '}
                                {convertDate(generaldocs_threads.updatedAt)}
                            </TableCell>
                        </>
                    ) : null}
                </TableRow>
            )
        );
    }

    unread_applications_docthread =
        props.student.applications?.length > 0
            ? props.student.applications
                  .filter((application) => isProgramDecided(application))
                  .map((application) =>
                      application.doc_modification_thread.map(
                          (application_doc_thread, idx) => (
                              <TableRow key={idx}>
                                  {!application_doc_thread.isFinalVersion &&
                                  application_doc_thread.latest_message_left_by_id !==
                                      props.student._id.toString() ? (
                                      <>
                                          <TableCell>
                                              <Link
                                                  component={LinkDom}
                                                  to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                                      application_doc_thread
                                                          .doc_thread_id._id
                                                  )}
                                                  underline="hover"
                                              >
                                                  {
                                                      application_doc_thread
                                                          .doc_thread_id
                                                          .file_type
                                                  }
                                              </Link>
                                          </TableCell>
                                          <TableCell>
                                              <Link
                                                  component={LinkDom}
                                                  to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                                      application_doc_thread
                                                          .doc_thread_id._id
                                                  )}
                                                  underline="hover"
                                              >
                                                  {application.programId.school}
                                                  {' - '}
                                                  {
                                                      application.programId
                                                          .program_name
                                                  }
                                              </Link>
                                          </TableCell>
                                          <TableCell>
                                              {convertDate(
                                                  application_doc_thread.updatedAt
                                              )}
                                          </TableCell>
                                      </>
                                  ) : null}
                              </TableRow>
                          )
                      )
                  )
            : null;

    return (
        <>
            {!check_academic_background_filled(
                props.student.academic_background
            ) ||
            !check_application_preference_filled(
                props.student.application_preference
            ) ||
            !check_languages_filled(props.student.academic_background) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.SURVEY_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('Profile', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please complete Profile so that your agent can understand your situation',
                                { ns: 'dashboard' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {!props.isCoursesFilled &&
            (props.student.academic_background?.university?.isGraduated ===
                'pending' ||
                props.student.academic_background?.university?.isGraduated ===
                    'Yes') ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.COURSES_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('My Courses', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please complete My Courses table. The agent will provide you with course analysis and courses suggestion.',
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {!check_applications_to_decided(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('My Applications', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                "Please refer to the programs provided by the agent and visit the school's program website for detailed information. Complete the school selection before the start of the application season.",
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {!all_applications_results_updated(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('Application Results', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please update your applications results to the corresponding program in this page below',
                                {
                                    ns: 'common'
                                }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {has_admissions(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.VISA_DOCS_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('Visa', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please consider working on visa, if you decide the offer.',
                                {
                                    ns: 'visa'
                                }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {/* check uni-assist */}
            {appConfig.vpdEnable &&
            !is_all_uni_assist_vpd_uploaded(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.UNI_ASSIST_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                Uni-Assist
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please go to the Uni-Assist section, follow the instructions to complete',
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {!is_personal_data_filled(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.PROFILE}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('Personal Data', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please be sure to update your Chinese and English names, as well as your date of birth information. This will affect the preparation of formal documents by the editor for you.',
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {are_base_documents_missing(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('My Documents', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                'Please upload documents as soon as possible. The agent needs them to understand your academic background.',
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {to_register_application_portals(props.student) ? (
                <TableRow>
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.PORTALS_MANAGEMENT_LINK}`}
                            underline="hover"
                        >
                            <Typography
                                sx={{ display: 'flex' }}
                                variant="body2"
                            >
                                {t('Portals Management', { ns: 'common' })}
                                <LaunchIcon fontSize="small" />
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Typography sx={{ display: 'flex' }} variant="body2">
                            {t(
                                "Please go to each school's website to create an account and provide your login credentials. This will facilitate the agent in conducting pre-submission checks for you in the future.",
                                { ns: 'courses' }
                            )}
                        </Typography>
                    </TableCell>
                    <TableCell />
                </TableRow>
            ) : null}
            {unread_general_generaldocs}
            {unread_applications_docthread}
        </>
    );
};

export default StudentTasksResponsive;
