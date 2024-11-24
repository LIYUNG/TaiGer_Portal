import React, { useMemo } from 'react';
import { Card, IconButton, Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import {
  FILE_MISSING_SYMBOL,
  FILE_OK_SYMBOL,
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
import { green, grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

function StudentOverviewTable(props) {
  const { t } = useTranslation();
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
      let target_degree = student.application_preference?.target_degree || '';
      let expected_application_year =
        student.application_preference?.expected_application_date || '';
      let expected_application_semster =
        student.application_preference?.expected_application_semester || '';

      transformedStudents.push({
        ...prepTaskStudent(student),
        applying_program_count: student.applying_program_count,
        year_semester: `${expected_application_year || 'TBD'}/ ${
          expected_application_semster || 'TBD'
        }`,
        id: student._id.toString(),
        student,
        target_degree,
        isGraduated:
          student.academic_background?.university?.high_school_isGraduated ===
          'Yes'
            ? student.academic_background?.university?.isGraduated === 'Yes'
              ? 'Yes'
              : 'No'
            : 'No',
        academic_background: student.academic_background,
        isMissingBaseDocs,
        CV: !isCVFinished_b
          ? isCVAssigned
            ? 'In Progress'
            : 'Not Created'
          : 'Done',
        ML: `${
          student.applications?.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                thread.doc_thread_id?.isFinalVersion &&
                thread.doc_thread_id?.file_type === 'ML'
            )
          ).length
        }/${
          student.applications.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                thread.doc_thread_id?.file_type === 'ML'
            )
          ).length
        }`,
        RL: `${
          student.applications.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                thread.doc_thread_id?.isFinalVersion &&
                (thread.doc_thread_id?.file_type.includes('RL') ||
                  thread.doc_thread_id?.file_type.includes('Recommendation'))
            )
          ).length
        }/${
          student.applications.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                (thread.doc_thread_id?.file_type.includes('RL') ||
                  thread.doc_thread_id?.file_type.includes('Recommendation'))
            )
          ).length
        }`,
        Essay: `${
          student.applications.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                thread.doc_thread_id?.isFinalVersion &&
                thread.doc_thread_id?.file_type.includes('Essay')
            )
          ).length
        }/${
          student.applications.filter((application) =>
            application.doc_modification_thread?.some(
              (thread) =>
                isProgramDecided(application) &&
                thread.doc_thread_id?.file_type.includes('Essay')
            )
          ).length
        }`,
        Portals: `${
          student.applications?.length === 0
            ? '-'
            : to_register_application_portals(student)
            ? 'Missing'
            : 'Complete'
        }`,
        uniassist: `${
          is_uni_assist_needed
            ? isall_uni_assist_vpd_uploaded
              ? 'Done'
              : `(${numb_uni_assist_vpd_uploaded}/${numb_uni_assist_vpd_needed}) Incomplete `
            : '-'
        }`,
        total_base_docs_needed,
        isEnglishPassed,
        isGermanPassed,
        nextProgram: getNextProgramName(student),
        nextProgramDeadline: getNextProgramDeadline(student),
        nextProgramDayleft: getNextProgramDayleft(student),
        nextProgramStatus: getNextProgramStatus(student),
        survey: isSurveyCompleted ? 'Yes' : 'No',
        basedocument: `${total_accepted_base_docs_needed}/${total_base_docs_needed}`,
        total_accepted_base_docs_needed,
        courseAnalysis: needUpdateCourseSelection(student),
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
      headerName: t('First-/ Last Name', { ns: 'common' }),
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
      headerName: t('Target Year /Semester', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 100
    },
    {
      field: 'target_degree',
      headerName: t('Target Degree', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 80
    },
    {
      field: 'agents_joined',
      headerName: t('Agents', { ns: 'common' }),
      width: 80,
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
      field: 'editors_joined',
      headerName: t('Editors', { ns: 'common' }),
      width: 80,
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
      headerName: t('Graduated', { ns: 'common' }),
      width: 70
    },
    {
      field: 'program_selection',
      headerName: t('Program Selection', { ns: 'common' }),
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(params.row.id)}`}
            component={LinkDom}
          >
            <Typography>
              {params.row.areProgramsAllDecided ? (
                <IconButton>{FILE_OK_SYMBOL}</IconButton>
              ) : (
                <IconButton>{FILE_MISSING_SYMBOL}</IconButton>
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
      headerName: t('Application', { ns: 'common' }),
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
                    <IconButton>{FILE_OK_SYMBOL}</IconButton>
                    <b>({params.row.num_apps_closed}</b>
                  </>
                ) : (
                  <>
                    <IconButton>{FILE_MISSING_SYMBOL}</IconButton>(
                    {params.row.num_apps_closed}
                  </>
                )}
                /{params.row.applying_program_count})
              </Typography>
            ) : (
              <Typography title="incomplete">
                <IconButton>{FILE_MISSING_SYMBOL}</IconButton>(
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
      headerName: t('Next Program to apply', { ns: 'common' }),
      width: 100
    },
    {
      field: 'nextProgramDeadline',
      headerName: t('Next Program deadline', { ns: 'common' }),
      width: 100
    },
    {
      field: 'nextProgramDayleft',
      headerName: t('Next Program Days left', { ns: 'common' }),
      width: 70
    },
    {
      field: 'nextProgramStatus',
      headerName: t('Next Program status', { ns: 'common' }),
      width: 70
    },
    {
      field: 'survey',
      headerName: t('Survey', { ns: 'common' }),
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
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'basedocument',
      headerName: t('Documents', { ns: 'common' }),
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
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'Language',
      headerName: t('Language', { ns: 'common' }),
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
                  <IconButton>
                    <CheckCircleIcon
                      fontSize="small"
                      style={{ color: green[500] }}
                      title={`complete ${params.row.academic_background?.language.english_certificate} ${params.row.academic_background?.language.english_score}`}
                    />
                  </IconButton>
                ) : (
                  !check_english_language_Notneeded(
                    params.row.academic_background
                  ) && (
                    <>
                      {FILE_MISSING_SYMBOL}
                      <HelpIcon
                        fontSize="small"
                        style={{ color: grey[400] }}
                        title={`Expected Test Date ${params.row.academic_background?.language.english_certificate} ${params.row.academic_background?.language.english_test_date}`}
                      />
                    </>
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
                  <IconButton>
                    <CheckCircleIcon
                      fontSize="small"
                      style={{ color: green[500] }}
                      title={`complete ${params.row.academic_background?.language.german_certificate} ${params.row.academic_background?.language.german_score}`}
                    />
                  </IconButton>
                ) : (
                  !check_german_language_Notneeded(
                    params.row.academic_background
                  ) && (
                    <HelpIcon
                      fontSize="small"
                      style={{ color: grey[400] }}
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
      headerName: t('Course Analysis', { ns: 'common' }),
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.COURSES_INPUT_LINK(params.row.id)}`}
            component={LinkDom}
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'CV',
      headerName: t('CV', { ns: 'common' }),
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
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'ML',
      headerName: t('ML', { ns: 'common' }),
      width: 80,
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
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'RL',
      headerName: t('RL', { ns: 'common' }),
      width: 80,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            component={LinkDom}
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'Essay',
      headerName: t('Essay', { ns: 'common' }),
      width: 80,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              params.row.id,
              DEMO.CVMLRL_HASH
            )}`}
            component={LinkDom}
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'Portals',
      headerName: t('Portals', { ns: 'common' }),
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`${DEMO.PORTALS_MANAGEMENT_STUDENTID_LINK(params.row.id)}`}
            component={LinkDom}
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'uniassist',
      headerName: t('Uni-Assist', { ns: 'common' }),
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
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'openofferreject',
      headerName: t('open/offer/reject', { ns: 'common' }),
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
