/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link } from '@mui/material';
import { Tabs, Tab, Box } from '@mui/material';
import PropTypes from 'prop-types';

import DEMO from '../../store/constant';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import {
  isProgramDecided,
  isProgramSubmitted
} from '../Utils/checking-functions';
import { useTranslation } from 'react-i18next';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import { BASE_URL } from '../../api/request';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function AdmissionsTable(props) {
  const students = props.students;
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const applicationResultsArray = (students, tag) => {
    const result = [];
    for (const student of students) {
      let editors_name_string = '';
      let agents_name_string = '';
      for (const editor of student.editors) {
        editors_name_string += `${editor.firstname} `;
      }
      for (const agent of student.agents) {
        agents_name_string += `${agent.firstname} `;
      }
      for (const application of student.applications) {
        if (isProgramDecided(application)) {
          if (isProgramSubmitted(application)) {
            if (tag === application.admission) {
              result.push({
                id: `${student._id}${application.programId._id}`,
                student_id: student._id,
                email: student.email,
                name: `${student.firstname}, ${student.lastname}`,
                first_name_chinese: `${student.firstname_chinese}`,
                last_name_chinese: `${student.lastname_chinese}`,
                editors: editors_name_string,
                agents: agents_name_string,
                program_id: application.programId._id,
                school: application.programId.school,
                degree: application.programId.degree,
                program_name: application.programId.program_name,
                finalEnrolment: application.finalEnrolment ? 'O' : '',
                admission: application.admission,
                admission_file_path:
                  application.admission_letter?.admission_file_path,
                application_year:
                  student.application_preference?.expected_application_date,
                semester: application.programId.semester
              });
            }
          } else if (application.closed === '-' && tag === '--') {
            result.push({
              id: `${student._id}${application.programId._id}`,
              student_id: student._id,
              email: student.email,
              name: `${student.firstname}, ${student.lastname}`,
              first_name_chinese: `${student.firstname_chinese}`,
              last_name_chinese: `${student.lastname_chinese}`,
              editors: editors_name_string,
              agents: agents_name_string,
              program_id: application.programId._id,
              school: application.programId.school,
              degree: application.programId.degree,
              program_name: application.programId.program_name,
              application_year:
                student.application_preference &&
                student.application_preference.expected_application_date,
              semester: application.programId.semester
            });
          }
        }
      }
    }
    return result;
  };

  let admissions_table = applicationResultsArray(students, 'O');
  let rejections_table = applicationResultsArray(students, 'X');
  let pending_table = applicationResultsArray(students, '-');
  let not_yet_closed_table = applicationResultsArray(students, '--');

  const admisstionTableColumns = [
    {
      field: 'first_name_chinese',
      headerName: t('First Name Chinese', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 80,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'last_name_chinese',
      headerName: t('Last Name Chinese', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 80,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'name',
      headerName: t('Name', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 150,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'email',
      headerName: t('Email', { ns: 'common' }),
      align: 'left',
      headerAlign: 'left',
      width: 150,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'agents',
      headerName: t('Agents', { ns: 'common' }),
      width: 100
    },
    {
      field: 'editors',
      headerName: t('Editors', { ns: 'common' }),
      width: 100
    },
    {
      field: 'school',
      headerName: t('School', { ns: 'common' }),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.program_id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'program_name',
      headerName: t('Program', { ns: 'common' }),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.program_id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'degree',
      headerName: t('Degree', { ns: 'common' }),
      width: 120
    },
    {
      field: 'application_year',
      headerName: t('Application Year', { ns: 'common' }),
      width: 120
    },
    {
      field: 'semester',
      headerName: t('Semester', { ns: 'common' }),
      width: 120
    },
    {
      field: 'admission_file_path',
      headerName: t('Admission Letter', { ns: 'common' }),
      width: 150,
      renderCell: (params) => {
        const linkUrl = `${BASE_URL}/api/admissions/${params.row.admission_file_path?.replace(
          /\\/g,
          '/'
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.row.admission_file_path !== '' &&
              (params.row.admission === 'O'
                ? t('Admission Letter', { ns: 'common' })
                : params.row.admission === 'X'
                ? t('Rejection Letter', { ns: 'common' })
                : '')}
          </Link>
        );
      }
    },
    {
      field: 'finalEnrolment',
      headerName: t('Decision', { ns: 'common' }),
      width: 150
    }
  ];
  const memoizedColumns = useMemo(
    () => admisstionTableColumns,
    [admisstionTableColumns]
  );

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab
            label={`${t('Admissions', {
              ns: 'admissions'
            })} ( ${admissions_table?.length || 0} )`}
            {...a11yProps(0)}
          />
          <Tab
            label={`${t('Rejections', { ns: 'admissions' })} ( ${
              rejections_table?.length || 0
            } )`}
            {...a11yProps(1)}
          />
          <Tab
            label={`${t('Pending Result', {
              ns: 'admissions'
            })} ( ${pending_table?.length || 0} )`}
            {...a11yProps(2)}
          />
          <Tab
            label={`${t('Not Closed Yet', { ns: 'admissions' })} ( ${
              not_yet_closed_table?.length || 0
            } )`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MuiDataGrid rows={admissions_table} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MuiDataGrid rows={rejections_table} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MuiDataGrid rows={pending_table} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MuiDataGrid rows={not_yet_closed_table} columns={memoizedColumns} />
      </CustomTabPanel>
    </>
  );
}

export default AdmissionsTable;
