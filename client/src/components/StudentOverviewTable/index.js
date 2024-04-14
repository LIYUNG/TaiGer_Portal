import React, { useMemo } from 'react';
import { Card, Link, Typography } from '@mui/material';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { Link as LinkDom } from 'react-router-dom';

import {
  FILE_DONT_CARE_SYMBOL,
  profile_list,
  statuses
} from '../../Demo/Utils/contants';
import { MuiDataGrid } from '../MuiDataGrid';
import {
  areProgramsDecidedMoreThanContract,
  check_academic_background_filled,
  check_all_decided_applications_submitted,
  check_english_language_Notneeded,
  check_english_language_passed,
  check_german_language_Notneeded,
  check_german_language_passed,
  check_if_there_is_german_language_info,
  check_student_needs_uni_assist,
  getNextProgramDayleft,
  getNextProgramDeadline,
  getNextProgramName,
  getNextProgramStatus,
  isCVFinished,
  isEnglishLanguageInfoComplete,
  isLanguageInfoComplete,
  isProgramDecided,
  isProgramSubmitted,
  is_all_uni_assist_vpd_uploaded,
  is_cv_assigned,
  needUpdateCourseSelection,
  numApplicationsDecided,
  numApplicationsSubmitted,
  num_uni_assist_vpd_needed,
  num_uni_assist_vpd_uploaded,
  prepTaskStudent,
  to_register_application_portals
} from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';

function StudentOverviewTable(props) {
  const tranform = (students) => {
    const transformedStudents = [];
    if (!students) {
      return [];
    }

    for (const student of students) {
      let keys = Object.keys(profile_list);
      let object_init = {};
      for (let i = 0; i < keys.length; i++) {
        object_init[keys[i]] = 'missing';
      }

      if (student.profile) {
        student.profile.forEach((item) => {
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
        student.academic_background
      );

      let isGermanPassed = check_german_language_passed(
        student.academic_background
      );

      let isSurveyCompleted = check_academic_background_filled(
        student.academic_background
      );

      let num_apps_decided = numApplicationsDecided(student);
      let num_apps_closed = numApplicationsSubmitted(student);
      let areProgramsAllDecided = areProgramsDecidedMoreThanContract(student);

      let is_All_Applications_Submitted =
        check_all_decided_applications_submitted(student);

      const isCVFinished_b = isCVFinished(student);
      const isCVAssigned = is_cv_assigned(student);

      var is_uni_assist_needed = check_student_needs_uni_assist(student);
      let isall_uni_assist_vpd_uploaded =
        is_all_uni_assist_vpd_uploaded(student);

      let numb_uni_assist_vpd_needed = num_uni_assist_vpd_needed(student);
      let numb_uni_assist_vpd_uploaded = num_uni_assist_vpd_uploaded(student);
      let expected_application_year =
        student.application_preference &&
        student.application_preference.expected_application_date
          ? student.application_preference.expected_application_date
          : '';
      let expected_application_semster =
        student.application_preference &&
        student.application_preference.expected_application_semester
          ? student.application_preference.expected_application_semester
          : '';

      transformedStudents.push({
        ...prepTaskStudent(student),
        applying_program_count: student.applying_program_count,
        year_semester: `${expected_application_year || 'TBD'}/ ${
          expected_application_semster || 'TBD'
        }`,
        id: student._id.toString(),
        student,
        isGraduated:
          student.academic_background?.university?.high_school_isGraduated ===
          'Yes'
            ? student.academic_background?.university?.isGraduated === 'Yes'
              ? 'Yes'
              : 'No'
            : 'No',
        academic_background: student.academic_background,
        isMissingBaseDocs,
        total_base_docs_needed,
        isEnglishPassed,
        isGermanPassed,
        nextProgram: getNextProgramName(student),
        nextProgramDeadline: getNextProgramDeadline(student),
        nextProgramDayleft: getNextProgramDayleft(student),
        nextProgramStatus: getNextProgramStatus(student),
        isSurveyCompleted,
        total_accepted_base_docs_needed,
        num_apps_decided,
        num_apps_closed,
        areProgramsAllDecided,
        is_All_Applications_Submitted,
        isCVFinished_b,
        isCVAssigned,
        is_uni_assist_needed,
        isall_uni_assist_vpd_uploaded,
        numb_uni_assist_vpd_needed,
        numb_uni_assist_vpd_uploaded,
        expected_application_year,
        expected_application_semster
      });
    }

    return transformedStudents;
  };
  const column = [
    {
      field: 'firstname_lastname',
      headerName: 'First-/ Last Name',
      align: 'left',
      headerAlign: 'left',
      width: 150,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <>
            <Link
              underline="hover"
              to={linkUrl}
              component={LinkDom}
              target="_blank"
              title={params.value}
            >
              {params.value}
            </Link>
          </>
        );
      }
    },
    {
      field: 'year_semester',
      headerName: 'Target Year /Semester',
      align: 'left',
      headerAlign: 'left',
      width: 100
    },
    {
      field: 'agents',
      headerName: 'Agents',
      width: 100,
      renderCell: (params) => {
        return params.row.agents?.map((agent) => (
          <Link
            underline="hover"
            to={DEMO.TEAM_AGENT_LINK(agent._id.toString())}
            component={LinkDom}
            target="_blank"
            title={agent.firstname}
            key={`${agent._id.toString()}`}
          >
            {`${agent.firstname} `}
          </Link>
        ));
      }
    },
    {
      field: 'editors',
      headerName: 'Editors',
      width: 100,
      renderCell: (params) => {
        return params.row.editors?.map((editor) => (
          <Link
            underline="hover"
            to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
            component={LinkDom}
            target="_blank"
            title={editor.firstname}
            key={`${editor._id.toString()}`}
          >
            {`${editor.firstname} `}
          </Link>
        ));
      }
    },
    {
      field: 'isGraduated',
      headerName: 'Graduated',
      width: 100
    },
    {
      field: 'program_selection',
      headerName: 'Program Selection',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(params.row.id)}`}
            component={LinkDom}
          >
            <Typography>
              {params.row.areProgramsAllDecided ? (
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
              {params.row.num_apps_decided >
              params.row.applying_program_count ? (
                <b>{params.row.num_apps_decided}</b>
              ) : (
                params.row.num_apps_decided
              )}
              /{params.row.applying_program_count})
            </Typography>
          </Link>
        );
      }
    },
    {
      field: 'application',
      headerName: 'Application',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(params.row.id)}`}
            component={LinkDom}
          >
            {params.row.is_All_Applications_Submitted ? (
              <Typography>
                {params.row.num_apps_closed >=
                params.row.applying_program_count ? (
                  <>
                    <IoCheckmarkCircle
                      size={24}
                      color="limegreen"
                      title="complete"
                      className="my-0 mx-2"
                    />
                    <b>({params.row.num_apps_closed}</b>
                  </>
                ) : (
                  <>
                    <AiFillQuestionCircle size={24} color="lightgray" />(
                    {params.row.num_apps_closed}
                  </>
                )}
                /{params.row.applying_program_count})
              </Typography>
            ) : (
              <Typography title="incomplete">
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  className="my-0 mx-2"
                />
                (
                {params.row.num_apps_closed >
                params.row.applying_program_count ? (
                  <b>{params.row.num_apps_closed}</b>
                ) : (
                  params.row.num_apps_closed
                )}
                /{params.row.applying_program_count})
              </Typography>
            )}
          </Link>
        );
      }
    },
    {
      field: 'nextProgram',
      headerName: 'Next Program to apply',
      width: 100
    },
    {
      field: 'nextProgramDeadline',
      headerName: 'Next Program deadline',
      width: 100
    },
    {
      field: 'nextProgramDayleft',
      headerName: 'Next Program Days left',
      width: 100
    },
    {
      field: 'nextProgramStatus',
      headerName: 'Next Program status',
      width: 100
    },
    {
      field: 'Survey',
      headerName: 'Survey',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.PROFILE_HASH
            )}`}
            component={LinkDom}
            style={{ textDecoration: 'none' }}
          >
            {params.row.isSurveyCompleted ? (
              <Typography title="complete">
                <IoCheckmarkCircle size={24} color="limegreen" />
              </Typography>
            ) : (
              <Typography title="incomplete">
                <AiFillQuestionCircle size={24} color="lightgray" />
              </Typography>
            )}
          </Link>
        );
      }
    },
    {
      field: 'basedocument',
      headerName: 'Base Documents',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.PROFILE_HASH
            )}`}
            component={LinkDom}
          >
            <Typography
              title={params.row.isMissingBaseDocs ? 'incomplete' : 'complete'}
            >
              {params.row.isMissingBaseDocs ? (
                <AiFillQuestionCircle size={24} color="lightgray" />
              ) : (
                <IoCheckmarkCircle size={24} color="limegreen" />
              )}
              {params.row.total_accepted_base_docs_needed}/
              {params.row.total_base_docs_needed}
            </Typography>
          </Link>
        );
      }
    },
    {
      field: 'Language',
      headerName: 'Language',
      width: 100,
      renderCell: (params) => {
        return !isLanguageInfoComplete(params.row.academic_background) ? (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.PROFILE_HASH
            )}`}
            component={LinkDom}
          >
            <Typography>No info</Typography>
          </Link>
        ) : (
          <>
            {isEnglishLanguageInfoComplete(params.row.academic_background) && (
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  params.row.id,
                  DEMO.SURVEY_HASH
                )}`}
                component={LinkDom}
              >
                E:
                {params.row.isEnglishPassed ? (
                  <IoCheckmarkCircle
                    size={18}
                    color="limegreen"
                    title={`complete ${params.row.academic_background?.language.english_certificate} ${params.row.academic_background?.language.english_score}`}
                  />
                ) : (
                  !check_english_language_Notneeded(
                    params.row.academic_background
                  ) && (
                    <AiFillQuestionCircle
                      size={18}
                      color="lightgray"
                      title={`Expected Test Date ${params.row.academic_background?.language.english_certificate} ${params.row.academic_background?.language.english_test_date}`}
                    />
                  )
                )}
              </Link>
            )}
            {check_if_there_is_german_language_info(
              params.row.academic_background
            ) && (
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  params.row.id,
                  DEMO.SURVEY_HASH
                )}`}
                component={LinkDom}
              >
                D:
                {params.row.isGermanPassed ? (
                  <IoCheckmarkCircle
                    size={18}
                    color="limegreen"
                    title={`complete ${params.row.academic_background?.language.german_certificate} ${params.row.academic_background?.language.german_score}`}
                  />
                ) : (
                  !check_german_language_Notneeded(
                    params.row.academic_background
                  ) && (
                    <AiFillQuestionCircle
                      size={18}
                      color="lightgray"
                      title={`Expected Test Date${params.row.academic_background?.language.german_certificate} ${params.row.academic_background?.language.german_test_date}`}
                    />
                  )
                )}
                {params.row.academic_background?.language.english_isPassed ===
                  '--' &&
                  params.row.academic_background?.language.german_isPassed ===
                    '--' &&
                  'Not needed'}
              </Link>
            )}
          </>
        );
      }
    },
    {
      field: 'courseAnalysis',
      headerName: 'Course Analysis',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.COURSES_INPUT_LINK(params.row._id)}`}
            component={LinkDom}
          >
            {needUpdateCourseSelection(params.row.student)}
          </Link>
        );
      }
    },
    {
      field: 'CV',
      headerName: 'CV',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            component={LinkDom}
          >
            {!params.row.isCVFinished_b ? (
              params.row.isCVAssigned ? (
                <Typography>
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="Working"
                  />
                </Typography>
              ) : (
                <Typography>
                  <BsFillExclamationCircleFill
                    size={23}
                    color="red"
                    title="Not created yet"
                  />
                </Typography>
              )
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
        );
      }
    },
    {
      field: 'ML',
      headerName: 'ML',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            className="text-info"
            component={LinkDom}
          >
            {
              params.row.student.applications?.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    thread.doc_thread_id?.isFinalVersion &&
                    thread.doc_thread_id?.file_type === 'ML'
                )
              ).length
            }
            /
            {
              params.row.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    thread.doc_thread_id?.file_type === 'ML'
                )
              ).length
            }
          </Link>
        );
      }
    },
    {
      field: 'RL',
      headerName: 'RL',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            component={LinkDom}
          >
            {
              params.row.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    thread.doc_thread_id?.isFinalVersion &&
                    (thread.doc_thread_id?.file_type.includes('RL') ||
                      thread.doc_thread_id?.file_type.includes(
                        'Recommendation'
                      ))
                )
              ).length
            }
            /
            {
              params.row.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    (thread.doc_thread_id?.file_type.includes('RL') ||
                      thread.doc_thread_id?.file_type.includes(
                        'Recommendation'
                      ))
                )
              ).length
            }
          </Link>
        );
      }
    },
    {
      field: 'Essay',
      headerName: 'Essay',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            component={LinkDom}
          >
            {
              params.row.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    thread.doc_thread_id?.isFinalVersion &&
                    thread.doc_thread_id?.file_type.includes('Essay')
                )
              ).length
            }
            /
            {
              params.row.student.applications.filter((application) =>
                application.doc_modification_thread?.some(
                  (thread) =>
                    isProgramDecided(application) &&
                    thread.doc_thread_id?.file_type.includes('Essay')
                )
              ).length
            }
          </Link>
        );
      }
    },
    {
      field: 'Portals',
      headerName: 'Portals',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.PORTALS_MANAGEMENT_STUDENTID_LINK(params.row.id)}`}
            component={LinkDom}
          >
            {params.row.student.applications?.length === 0 ? (
              <Typography title="Not needed">
                {FILE_DONT_CARE_SYMBOL}
              </Typography>
            ) : to_register_application_portals(params.row.student) ? (
              <Typography>
                <AiFillQuestionCircle
                  size={24}
                  color="lightgray"
                  title="Missing"
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
        );
      }
    },
    {
      field: 'uniassist',
      headerName: 'Uni-Assist',
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.UNIASSIST_HASH
            )}`}
            component={LinkDom}
          >
            {params.row.is_uni_assist_needed ? (
              params.row.isall_uni_assist_vpd_uploaded ? (
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
                  {params.row.numb_uni_assist_vpd_uploaded}/
                  {params.row.numb_uni_assist_vpd_needed})
                </Typography>
              )
            ) : (
              <Typography title="Not needed">
                {FILE_DONT_CARE_SYMBOL}
              </Typography>
            )}
          </Link>
        );
      }
    },
    {
      field: 'openofferreject',
      headerName: 'open/offer/reject',
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {
              params.row.student.applications.filter(
                (application) =>
                  isProgramSubmitted(application) &&
                  isProgramDecided(application) &&
                  application.admission === '-'
              ).length
            }
            /
            {
              params.row.student.applications.filter(
                (application) =>
                  isProgramSubmitted(application) &&
                  isProgramDecided(application) &&
                  application.admission === 'O'
              ).length
            }
            /
            {
              params.row.student.applications.filter(
                (application) =>
                  isProgramSubmitted(application) &&
                  isProgramDecided(application) &&
                  application.admission === 'X'
              ).length
            }
          </>
        );
      }
    }
  ];
  const memoizedColumns = useMemo(() => column, [column]);

  const rows = tranform(props.students);
  return (
    <Card>
      <MuiDataGrid rows={rows} columns={memoizedColumns} />
    </Card>
  );
}

export default StudentOverviewTable;
