/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link } from '@mui/material';
import { Tabs, Tab, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { isProgramSubmitted } from '@taiger-common/core';

import DEMO from '../../store/constant';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import { BASE_URL } from '../../api/request';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

const AdmissionsTable = ({ admissions }) => {
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const applicationResultsArray = (admissions, tag) => {
        const result = [];
        if (!admissions || !Array.isArray(admissions)) return result;

        for (const application of admissions) {
            if (isProgramSubmitted(application)) {
                if (tag === application.admission) {
                    result.push({
                        ...application,
                        id: `${application._id}${application.programId}`,
                        student_id: application._id,
                        name: `${application.firstname}, ${application.lastname}`,
                        editors: application.editors?.join(' '),
                        agents: application.agents?.join(' '),
                        finalEnrolment: application.finalEnrolment ? 'O' : '',
                        admission_file_path:
                            application.admission_letter?.admission_file_path,
                        application_year:
                            application.application_preference
                                ?.expected_application_date
                    });
                }
            } else if (application.closed === '-' && tag === '--') {
                result.push({
                    ...application,
                    id: `${application._id}${application.programId}`,
                    student_id: application._id,
                    name: `${application.firstname}, ${application.lastname}`,
                    editors: application.editors?.join(' '),
                    agents: application.agents?.join(' '),
                    application_year:
                        application.application_preference &&
                        application.application_preference
                            .expected_application_date
                });
            }
        }
        return result;
    };

    let admissions_table = applicationResultsArray(admissions, 'O');
    let rejections_table = applicationResultsArray(admissions, 'X');
    let pending_table = applicationResultsArray(admissions, '-');
    let not_yet_closed_table = applicationResultsArray(admissions, '--');

    const admisstionTableColumns = [
        {
            field: 'firstname_chinese',
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
                    >
                        {params.value}
                    </Link>
                );
            }
        },
        {
            field: 'lastname_chinese',
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.programId)}`;
                return (
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.programId)}`;
                return (
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={linkUrl}
                        underline="hover"
                    >
                        {params.row.admission_file_path !== ''
                            ? params.row.admission === 'O'
                                ? t('Admission Letter', { ns: 'common' })
                                : params.row.admission === 'X'
                                  ? t('Rejection Letter', { ns: 'common' })
                                  : ''
                            : null}
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
                    aria-label="basic tabs example"
                    onChange={handleChange}
                    scrollButtons="auto"
                    value={value}
                    variant="scrollable"
                >
                    <Tab
                        label={`${t('Admissions', {
                            ns: 'admissions'
                        })} ( ${admissions_table?.length || 0} )`}
                        {...a11yProps(value, 0)}
                    />
                    <Tab
                        label={`${t('Rejections', { ns: 'admissions' })} ( ${
                            rejections_table?.length || 0
                        } )`}
                        {...a11yProps(value, 1)}
                    />
                    <Tab
                        label={`${t('Pending Result', {
                            ns: 'admissions'
                        })} ( ${pending_table?.length || 0} )`}
                        {...a11yProps(value, 2)}
                    />
                    <Tab
                        label={`${t('Not Closed Yet', { ns: 'admissions' })} ( ${
                            not_yet_closed_table?.length || 0
                        } )`}
                        {...a11yProps(value, 3)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel index={0} value={value}>
                <MuiDataGrid
                    columns={memoizedColumns}
                    rows={admissions_table}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={value}>
                <MuiDataGrid
                    columns={memoizedColumns}
                    rows={rejections_table}
                />
            </CustomTabPanel>
            <CustomTabPanel index={2} value={value}>
                <MuiDataGrid columns={memoizedColumns} rows={pending_table} />
            </CustomTabPanel>
            <CustomTabPanel index={3} value={value}>
                <MuiDataGrid
                    columns={memoizedColumns}
                    rows={not_yet_closed_table}
                />
            </CustomTabPanel>
        </>
    );
};

export default AdmissionsTable;
