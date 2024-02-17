import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { Link, TableCell, TableRow, Typography } from '@mui/material';
import { BsFillExclamationCircleFill, BsDash } from 'react-icons/bs';
import { IoCheckmarkCircle } from 'react-icons/io5';

import {
  isLanguageInfoComplete,
  isEnglishLanguageInfoComplete,
  check_if_there_is_german_language_info,
  check_english_language_Notneeded,
  check_german_language_Notneeded,
  check_english_language_passed,
  check_german_language_passed,
  check_academic_background_filled,
  getNextProgramName,
  getNextProgramDeadline,
  getNextProgramDayleft,
  getNextProgramStatus,
  numApplicationsDecided,
  numApplicationsSubmitted,
  areProgramsDecidedMoreThanContract,
  check_all_decided_applications_submitted,
  isCVFinished,
  is_cv_assigned,
  check_student_needs_uni_assist,
  is_all_uni_assist_vpd_uploaded,
  num_uni_assist_vpd_needed,
  num_uni_assist_vpd_uploaded,
  to_register_application_portals,
  needUpdateCourseSelection
} from '../../../Utils/checking-functions';
import { profile_list, statuses } from '../../../Utils/contants';
import DEMO from '../../../../store/constant';

function AgentReviewing(props) {
  let keys = Object.keys(profile_list);
  let object_init = {};
  for (let i = 0; i < keys.length; i++) {
    object_init[keys[i]] = 'missing';
  }

  if (props.student.profile) {
    props.student.profile.forEach((item) => {
      object_init[item.name] = statuses[item.status] || '';
    });
  }
  let isMissingBaseDocs = false;
  let total_base_docs_needed = 0;
  let total_accepted_base_docs_needed = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if (object_init[keys[i]] !== statuses.notneeded) {
      total_base_docs_needed += 1;
    }
    if (
      object_init[keys[i]] === statuses.accepted &&
      object_init[keys[i]] !== statuses.notneeded
    ) {
      total_accepted_base_docs_needed += 1;
    }
  }
  isMissingBaseDocs =
    total_base_docs_needed > total_accepted_base_docs_needed ? true : false;
  // TODO: logic improvement (necessary field)
  let isEnglishPassed = check_english_language_passed(
    props.student.academic_background
  );

  let isGermanPassed = check_german_language_passed(
    props.student.academic_background
  );

  let isSurveyCompleted = check_academic_background_filled(
    props.student.academic_background
  );

  let num_apps_decided = numApplicationsDecided(props.student);
  let num_apps_closed = numApplicationsSubmitted(props.student);
  let areProgramsAllDecided = areProgramsDecidedMoreThanContract(props.student);

  let is_All_Applications_Submitted = check_all_decided_applications_submitted(
    props.student
  );

  const isCVFinished_b = isCVFinished(props.student);
  const isCVAssigned = is_cv_assigned(props.student);

  var is_uni_assist_needed = check_student_needs_uni_assist(props.student);
  let isall_uni_assist_vpd_uploaded = is_all_uni_assist_vpd_uploaded(
    props.student
  );

  let numb_uni_assist_vpd_needed = num_uni_assist_vpd_needed(props.student);
  let numb_uni_assist_vpd_uploaded = num_uni_assist_vpd_uploaded(props.student);
  let expected_application_year =
    props.student.application_preference &&
    props.student.application_preference.expected_application_date
      ? props.student.application_preference.expected_application_date
      : '';
  let expected_application_semster =
    props.student.application_preference &&
    props.student.application_preference.expected_application_semester
      ? props.student.application_preference.expected_application_semester
      : '';
  return (
    <>
      <TableRow>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              DEMO.PROFILE
            )}`}
            component={LinkDom}
          >
            {expected_application_year || <b className="text-danger">TBD</b>}
            {'/'}
            {expected_application_semster || <b className="text-danger">TBD</b>}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              DEMO.PROFILE
            )}`}
            component={LinkDom}
          >
            {props.student.firstname}
            {' - '}
            {props.student.lastname}
            {'|'}
            {props.student.lastname_chinese
              ? props.student.lastname_chinese
              : ''}
            {props.student.firstname_chinese
              ? props.student.firstname_chinese
              : ''}
            {', '}
            {props.student.birthday}
          </Link>
        </TableCell>
        <TableCell>
          {props.student.agents?.map((agent, i) => (
            <Link
              key={i}
              to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
              component={LinkDom}
            >
              {agent.firstname}
            </Link>
          ))}
        </TableCell>
        <TableCell>
          {props.student.editors?.map((editor, i) => (
            <Link
              key={i}
              to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
              component={LinkDom}
            >
              {editor.firstname}
            </Link>
          ))}
        </TableCell>
        <TableCell>
          {props.student.academic_background?.university
            ?.high_school_isGraduated === 'Yes'
            ? props.student.academic_background?.university?.isGraduated ===
              'Yes'
              ? 'Yes'
              : 'No'
            : 'No'}
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(props.student._id)}`}
            component={LinkDom}
          >
            <Typography>
              {areProgramsAllDecided ? (
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="complete"
                  className="my-0 mx-2"
                />
              ) : (
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  title="incomplete"
                  className="my-0 mx-2"
                />
              )}
              (
              {num_apps_decided > props.student.applying_program_count ? (
                <b>{num_apps_decided}</b>
              ) : (
                num_apps_decided
              )}
              /{props.student.applying_program_count})
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(props.student._id)}`}
            component={LinkDom}
          >
            {is_All_Applications_Submitted ? (
              <Typography>
                {num_apps_closed >= props.student.applying_program_count ? (
                  <>
                    <IoCheckmarkCircle
                      size={24}
                      color="limegreen"
                      title="complete"
                      className="my-0 mx-2"
                    />
                    <b>({num_apps_closed}</b>
                  </>
                ) : (
                  <>
                    <AiFillQuestionCircle
                      size={24}
                      color="lightgray"
                      className="my-0 mx-2"
                    />
                    ({num_apps_closed}
                  </>
                )}
                /{props.student.applying_program_count})
              </Typography>
            ) : (
              <Typography title="incomplete">
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  className="my-0 mx-2"
                />
                (
                {num_apps_closed > props.student.applying_program_count ? (
                  <b>{num_apps_closed}</b>
                ) : (
                  num_apps_closed
                )}
                /{props.student.applying_program_count})
              </Typography>
            )}
          </Link>
        </TableCell>
        <TableCell>{getNextProgramName(props.student)}</TableCell>
        <TableCell>{getNextProgramDeadline(props.student)}</TableCell>
        <TableCell>{getNextProgramDayleft(props.student)}</TableCell>
        <TableCell>{getNextProgramStatus(props.student)}</TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/background'
            )}`}
            component={LinkDom}
            style={{ textDecoration: 'none' }}
          >
            {isSurveyCompleted ? (
              <Typography title="complete">
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  className="py-0 my-0 mx-2"
                />
              </Typography>
            ) : (
              <Typography title="incomplete">
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  className="py-0 my-0 mx-2"
                />
              </Typography>
            )}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              DEMO.PROFILE
            )}`}
            component={LinkDom}
          >
            <Typography title={isMissingBaseDocs ? 'incomplete' : 'complete'}>
              {isMissingBaseDocs ? (
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  className="my-0 mx-2"
                />
              ) : (
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  className="my-0 mx-2"
                />
              )}
              {total_accepted_base_docs_needed}/{total_base_docs_needed}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          {!isLanguageInfoComplete(props.student.academic_background) ? (
            <Link
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                props.student._id,
                '/background'
              )}`}
              component={LinkDom}
            >
              <Typography>No info</Typography>
            </Link>
          ) : (
            <>
              {isEnglishLanguageInfoComplete(
                props.student.academic_background
              ) && (
                <Link
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    props.student._id,
                    '/background'
                  )}`}
                  component={LinkDom}
                >
                  {isEnglishPassed ? (
                    <Typography>
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="my-0 me-2"
                      />
                      {
                        props.student.academic_background.language
                          .english_certificate
                      }{' '}
                      {props.student.academic_background.language.english_score}
                    </Typography>
                  ) : (
                    !check_english_language_Notneeded(
                      props.student.academic_background
                    ) && (
                      <Typography title="Expected Test Date">
                        <AiFillQuestionCircle
                          size={24}
                          color="lightgray"
                          className="my-0 me-2"
                        />
                        {
                          props.student.academic_background.language
                            .english_certificate
                        }{' '}
                        {
                          props.student.academic_background.language
                            .english_test_date
                        }
                      </Typography>
                    )
                  )}
                </Link>
              )}
              {check_if_there_is_german_language_info(
                props.student.academic_background
              ) && (
                <Link
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    props.student._id,
                    '/background'
                  )}`}
                  component={LinkDom}
                >
                  {isGermanPassed ? (
                    <Typography>
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="my-0 me-2"
                      />
                      {
                        props.student.academic_background.language
                          .german_certificate
                      }{' '}
                      {props.student.academic_background.language.german_score}
                    </Typography>
                  ) : (
                    !check_german_language_Notneeded(
                      props.student.academic_background
                    ) && (
                      <Typography title="Expected Test Date">
                        <AiFillQuestionCircle
                          size={24}
                          color="lightgray"
                          className="my-0 me-2"
                        />
                        {
                          props.student.academic_background.language
                            .german_certificate
                        }{' '}
                        {
                          props.student.academic_background.language
                            .german_test_date
                        }
                      </Typography>
                    )
                  )}
                  {props.student.academic_background.language
                    .english_isPassed === '--' &&
                    props.student.academic_background.language
                      .german_isPassed === '--' && (
                      <Typography title="Not needed">Not needed</Typography>
                    )}
                </Link>
              )}
            </>
          )}
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.COURSES_INPUT_LINK(props.student._id.toString())}`}
            component={LinkDom}
          >
            {needUpdateCourseSelection(props.student)}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/CV_ML_RL'
            )}`}
            component={LinkDom}
          >
            {!isCVFinished_b ? (
              isCVAssigned ? (
                <Typography>
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="Working"
                    className="my-0 mx-2"
                  />
                </Typography>
              ) : (
                <Typography>
                  <BsFillExclamationCircleFill
                    size={23}
                    color="red"
                    title="Not created yet"
                    className="my-0 mx-2"
                  />
                </Typography>
              )
            ) : (
              <Typography>
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="complete"
                  className="my-0 mx-2"
                />
              </Typography>
            )}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/CV_ML_RL'
            )}`}
            className="text-info"
            component={LinkDom}
          >
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    thread.doc_thread_id.isFinalVersion &&
                    thread.doc_thread_id.file_type === 'ML'
                )
              ).length
            }
            /
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    thread.doc_thread_id.file_type === 'ML'
                )
              ).length
            }
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/CV_ML_RL'
            )}`}
            component={LinkDom}
          >
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    thread.doc_thread_id.isFinalVersion &&
                    (thread.doc_thread_id.file_type.includes('RL') ||
                      thread.doc_thread_id.file_type.includes('Recommendation'))
                )
              ).length
            }
            /
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    (thread.doc_thread_id.file_type.includes('RL') ||
                      thread.doc_thread_id.file_type.includes('Recommendation'))
                )
              ).length
            }
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/CV_ML_RL'
            )}`}
            component={LinkDom}
          >
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    thread.doc_thread_id.isFinalVersion &&
                    thread.doc_thread_id.file_type.includes('Essay')
                )
              ).length
            }
            /
            {
              props.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    application.decided === 'O' &&
                    thread.doc_thread_id.file_type.includes('Essay')
                )
              ).length
            }
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.PORTALS_MANAGEMENT_STUDENTID_LINK(props.student._id)}`}
            component={LinkDom}
          >
            {props.student.applications?.length === 0 ? (
              <Typography title="Not needed">
                <BsDash size={24} color="lightgray" className="mx-2" />
              </Typography>
            ) : to_register_application_portals(props.student) ? (
              <Typography>
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  title="Missing"
                  className="my-0 mx-2"
                />
              </Typography>
            ) : (
              <Typography>
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="complete"
                />
              </Typography>
            )}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              DEMO.UNI_ASSIST_LINK
            )}`}
            component={LinkDom}
          >
            {is_uni_assist_needed ? (
              isall_uni_assist_vpd_uploaded ? (
                <Typography title="complete">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="Complete"
                  />
                </Typography>
              ) : (
                <Typography title="incomplete">
                  <AiFillQuestionCircle size={24} color="lightgray" />(
                  {numb_uni_assist_vpd_uploaded}/{numb_uni_assist_vpd_needed})
                </Typography>
              )
            ) : (
              <Typography title="Not needed">
                <BsDash size={24} color="lightgray" className="mx-2" />
              </Typography>
            )}
          </Link>
        </TableCell>
        <TableCell>
          {
            props.student.applications.filter(
              (application) =>
                application.closed === 'O' &&
                application.decided === 'O' &&
                application.admission === '-'
            ).length
          }
          /
          {
            props.student.applications.filter(
              (application) =>
                application.closed === 'O' &&
                application.decided === 'O' &&
                application.admission === 'O'
            ).length
          }
          /
          {
            props.student.applications.filter(
              (application) =>
                application.closed === 'O' &&
                application.decided === 'O' &&
                application.admission === 'X'
            ).length
          }
        </TableCell>
      </TableRow>
    </>
  );
}

export default AgentReviewing;
