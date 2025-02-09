import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Compare as CompareIcon,
    OpenInNew as OpenInNewIcon,
    Info as InfoIcon
} from '@mui/icons-material';

import {
    Box,
    Button,
    Card,
    CardContent,
    Link,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Tabs,
    Tab,
    Breadcrumbs
} from '@mui/material';
import {
    is_TaiGer_Admin,
    is_TaiGer_AdminAgent,
    is_TaiGer_role,
    isProgramWithdraw
} from '@taiger-common/core';
import { is_TaiGer_External } from '@taiger-common/core';

import {
    isApplicationOpen,
    LinkableNewlineText
} from '../Utils/checking-functions';
import {
    IS_DEV,
    convertDate,
    COUNTRIES_MAPPING,
    english_test_hand_after,
    german_test_hand_after,
    program_fields_application_dates,
    program_fields_english_languages_test,
    program_fields_other_test,
    program_fields_others,
    program_fields_overview,
    program_fields_special_documents,
    program_fields_special_notes,
    programField2Label
} from '../../utils/contants';
import { HighlightTextDiff } from '../Utils/diffChecker';
import Banner from '../../components/Banner/Banner';
import DEMO from '../../store/constant';
import ProgramReport from './ProgramReport';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';

const SingleProgramView = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [value, setValue] = useState(0);
    const [studentsTabValue, setStudentsTabValue] = useState(0);
    const versions = props?.versions || {};

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStudentsTabChange = (event, newValue) => {
        setStudentsTabValue(newValue);
    };

    const convertToText = (value) => {
        if (!value) return ''; // undefined or null
        if (typeof value === 'string') return value;
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (Array.isArray(value)) return value.join(', ');
    };

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                {is_TaiGer_role(user) ? (
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.PROGRAMS}`}
                        underline="hover"
                    >
                        {t('Program List', { ns: 'common' })}
                    </Link>
                ) : (
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(user._id.toString())}`}
                        underline="hover"
                    >
                        {t('Applications')}
                    </Link>
                )}
                <Typography color="text.primary">
                    {`${props.program.school}-${props.program.program_name}`}
                </Typography>
            </Breadcrumbs>
            <Box sx={{ my: 1 }}>
                <Banner
                    ReadOnlyMode={true}
                    bg="primary"
                    link_name=""
                    notification_key={undefined}
                    removeBanner={() => {}}
                    text={`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}
                    title="info"
                    to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                />
            </Box>

            <Grid container spacing={2}>
                <Grid item md={8} xs={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            aria-label="basic tabs example"
                            onChange={handleChange}
                            scrollButtons="auto"
                            value={value}
                            variant="scrollable"
                        >
                            <Tab
                                label={t('Overview')}
                                {...a11yProps(value, 0)}
                            />
                            <Tab
                                label={t('Application Deadline', {
                                    ns: 'common'
                                })}
                                {...a11yProps(value, 1)}
                            />
                            <Tab
                                label={t('Specific Requirements', {
                                    ns: 'common'
                                })}
                                {...a11yProps(value, 2)}
                            />
                            <Tab
                                label={t('Special Documents', { ns: 'common' })}
                                {...a11yProps(value, 3)}
                            />
                            <Tab label={t('Others')} {...a11yProps(value, 4)} />
                            {versions?.changes?.length > 0 ? (
                                <Tab
                                    label={t('Edit History', { ns: 'common' })}
                                    {...a11yProps(value, 5)}
                                />
                            ) : null}
                        </Tabs>
                    </Box>
                    <CustomTabPanel index={0} value={value}>
                        <Card>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                {program_fields_overview.map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={4} xs={12}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8} xs={12}>
                                                <LinkableNewlineText
                                                    text={props.program[
                                                        program_field.prop
                                                    ]?.toString()}
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                            </Grid>
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={1} value={value}>
                        <Card>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                {program_fields_application_dates.map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={4} xs={12}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8} xs={12}>
                                                <LinkableNewlineText
                                                    text={
                                                        props.program[
                                                            program_field.prop
                                                        ]
                                                    }
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                            </Grid>
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={2} value={value}>
                        <Card>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                {[...english_test_hand_after].map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={4} xs={6}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8} xs={6}>
                                                <LinkableNewlineText
                                                    text={props.program[
                                                        program_field.prop
                                                    ]?.toString()}
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                                {program_fields_english_languages_test.map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={2} xs={6}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={2} xs={6}>
                                                <LinkableNewlineText
                                                    text={
                                                        props.program[
                                                            program_field.prop
                                                        ]
                                                    }
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={3}>
                                                {props.program[
                                                    `${program_field.prop}_reading`
                                                ] ? (
                                                    <Typography fontWeight="bold">
                                                        {t('Reading', {
                                                            ns: 'common'
                                                        })}
                                                        :{' '}
                                                        {
                                                            props.program[
                                                                `${program_field.prop}_reading`
                                                            ]
                                                        }
                                                    </Typography>
                                                ) : null}{' '}
                                            </Grid>
                                            <Grid item md={2} xs={3}>
                                                {props.program[
                                                    `${program_field.prop}_listening`
                                                ] ? (
                                                    <Typography fontWeight="bold">
                                                        {t('Listening', {
                                                            ns: 'common'
                                                        })}
                                                        :{' '}
                                                        {
                                                            props.program[
                                                                `${program_field.prop}_listening`
                                                            ]
                                                        }
                                                    </Typography>
                                                ) : null}{' '}
                                            </Grid>
                                            <Grid item md={2} xs={3}>
                                                {props.program[
                                                    `${program_field.prop}_speaking`
                                                ] ? (
                                                    <Typography fontWeight="bold">
                                                        {t('Speaking', {
                                                            ns: 'common'
                                                        })}
                                                        :{' '}
                                                        {
                                                            props.program[
                                                                `${program_field.prop}_speaking`
                                                            ]
                                                        }
                                                    </Typography>
                                                ) : null}{' '}
                                            </Grid>
                                            <Grid item md={2} xs={3}>
                                                {props.program[
                                                    `${program_field.prop}_writing`
                                                ] ? (
                                                    <Typography fontWeight="bold">
                                                        {t('Writing', {
                                                            ns: 'common'
                                                        })}
                                                        :{' '}
                                                        {
                                                            props.program[
                                                                `${program_field.prop}_writing`
                                                            ]
                                                        }
                                                    </Typography>
                                                ) : null}
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                                {[
                                    ...german_test_hand_after,
                                    ...program_fields_other_test,
                                    ...program_fields_special_notes
                                ].map((program_field, i) => (
                                    <Fragment key={i}>
                                        <Grid item md={4} xs={12}>
                                            <Typography fontWeight="bold">
                                                {t(`${program_field.name}`, {
                                                    ns: 'common'
                                                })}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <LinkableNewlineText
                                                text={props.program[
                                                    program_field.prop
                                                ]?.toString()}
                                            />
                                        </Grid>
                                    </Fragment>
                                ))}
                            </Grid>
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={3} value={value}>
                        <Card>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                {program_fields_special_documents.map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={4} xs={12}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8} xs={12}>
                                                <LinkableNewlineText
                                                    text={convertToText(
                                                        props.program[
                                                            program_field.prop
                                                        ]
                                                    )}
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                            </Grid>
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={4} value={value}>
                        <Card>
                            <Grid container spacing={2} sx={{ p: 2 }}>
                                {program_fields_others.map(
                                    (program_field, i) => (
                                        <Fragment key={i}>
                                            <Grid item md={4} xs={12}>
                                                <Typography fontWeight="bold">
                                                    {t(
                                                        `${program_field.name}`,
                                                        { ns: 'common' }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={8} xs={12}>
                                                <LinkableNewlineText
                                                    text={
                                                        props.program[
                                                            program_field.prop
                                                        ]
                                                    }
                                                />
                                            </Grid>
                                        </Fragment>
                                    )
                                )}
                                <Grid item md={4} xs={12}>
                                    <Typography fontWeight="bold">
                                        {t(`Country`, { ns: 'common' })}
                                    </Typography>
                                </Grid>
                                <Grid item md={8} xs={12}>
                                    <span>
                                        <img
                                            alt="Logo"
                                            src={`/assets/logo/country_logo/svg/${props.program.country}.svg`}
                                            style={{
                                                maxWidth: '32px',
                                                maxHeight: '32px'
                                            }}
                                            title={
                                                COUNTRIES_MAPPING[
                                                    props.program.country
                                                ]
                                            }
                                        />
                                    </span>
                                </Grid>
                                {props.program.application_portal_a ? (
                                    <>
                                        <Grid item md={4} xs={12}>
                                            <Typography fontWeight="bold">
                                                Portal Link 1
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <LinkableNewlineText
                                                text={
                                                    props.program
                                                        .application_portal_a
                                                }
                                            />
                                        </Grid>

                                        <Grid item md={4} xs={12}>
                                            <Typography fontWeight="bold">
                                                Portal Instructions 1
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <LinkableNewlineText
                                                text={
                                                    props.program
                                                        .application_portal_a_instructions
                                                }
                                            />
                                        </Grid>
                                    </>
                                ) : null}
                                {props.program.application_portal_b ? (
                                    <>
                                        <Grid item md={4} xs={12}>
                                            <Typography fontWeight="bold">
                                                Portal Link 2
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <LinkableNewlineText
                                                text={
                                                    props.program
                                                        .application_portal_b
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                            <Typography fontWeight="bold">
                                                Portal Instructions 2
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <LinkableNewlineText
                                                text={
                                                    props.program
                                                        .application_portal_b_instructions
                                                }
                                            />
                                        </Grid>
                                    </>
                                ) : null}
                                <Grid item md={4} xs={12}>
                                    <Typography fontWeight="bold">
                                        {t('Last update', { ns: 'common' })}
                                    </Typography>
                                </Grid>
                                <Grid item md={8} xs={12}>
                                    <Typography fontWeight="bold">
                                        {convertDate(props.program.updatedAt)}
                                    </Typography>
                                </Grid>
                                {is_TaiGer_AdminAgent(user) ? (
                                    <>
                                        <Grid item md={4} xs={12}>
                                            <Typography>
                                                {t('Updated by', {
                                                    ns: 'common'
                                                })}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={8} xs={12}>
                                            <Typography>
                                                {props.program.whoupdated}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                            <Typography>
                                                {t('Group', { ns: 'common' })}
                                            </Typography>
                                        </Grid>
                                    </>
                                ) : null}
                            </Grid>
                        </Card>
                    </CustomTabPanel>
                    {versions?.changes?.length > 0 ? (
                        <CustomTabPanel
                            index={5}
                            style={{ width: '100%', overflowY: 'auto' }}
                            value={value}
                        >
                            {IS_DEV ? (
                                <Button
                                    onClick={() => props.setDiffModalShow()}
                                >
                                    <CompareIcon fontSize="small" /> Incoming
                                    changes - Compare
                                </Button>
                            ) : null}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <strong>
                                                {t('#', { ns: 'common' })}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {t('Changed By', {
                                                    ns: 'common'
                                                })}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {t('Field', { ns: 'common' })}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <strong>
                                                {t('Content', { ns: 'common' })}
                                            </strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {versions.changes
                                        .slice()
                                        .reverse()
                                        .map((change, index) => {
                                            const reverseIndex = versions
                                                .changes.length
                                                ? versions.changes.length -
                                                  index
                                                : index;
                                            const keys = Object.keys({
                                                ...change.originalValues,
                                                ...change.updatedValues
                                            });
                                            return (
                                                <Fragment key={index}>
                                                    <TableRow />
                                                    <TableRow>
                                                        <TableCell
                                                            rowSpan={
                                                                (keys?.length ||
                                                                    0) + 1
                                                            }
                                                        >
                                                            <Typography>
                                                                {reverseIndex}{' '}
                                                                {change?.changeRequest ? (
                                                                    <div
                                                                        title={`from change request ${change?.changeRequest}`}
                                                                    >
                                                                        <InfoIcon fontSize="small" />
                                                                    </div>
                                                                ) : null}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell
                                                            rowSpan={
                                                                (keys?.length ||
                                                                    0) + 1
                                                            }
                                                        >
                                                            <div>
                                                                {
                                                                    change.changedBy
                                                                }
                                                            </div>
                                                            <div>
                                                                {convertDate(
                                                                    change.changedAt
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    {keys.map((key, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                {t(
                                                                    programField2Label?.[
                                                                        key
                                                                    ] || key,
                                                                    {
                                                                        ns: 'common'
                                                                    }
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <HighlightTextDiff
                                                                    original={
                                                                        change
                                                                            ?.originalValues?.[
                                                                            key
                                                                        ]
                                                                    }
                                                                    updated={
                                                                        change
                                                                            ?.updatedValues?.[
                                                                            key
                                                                        ]
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </Fragment>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </CustomTabPanel>
                    ) : null}
                </Grid>
                <Grid item md={4} xs={12}>
                    {is_TaiGer_AdminAgent(user) || is_TaiGer_External(user) ? (
                        <Grid alignItems="center" container spacing={1}>
                            {is_TaiGer_AdminAgent(user) ? (
                                <Grid item>
                                    <Button
                                        color="primary"
                                        fullWidth
                                        onClick={() =>
                                            props.setModalShowAssignWindow(true)
                                        }
                                        variant="outlined"
                                    >
                                        {t('Assign', { ns: 'common' })}
                                    </Button>
                                </Grid>
                            ) : null}
                            <Grid item>
                                <Button
                                    color="info"
                                    component={LinkDom}
                                    to={DEMO.PROGRAM_EDIT(
                                        props.program._id?.toString()
                                    )}
                                    variant="contained"
                                >
                                    {t('Edit', { ns: 'common' })}
                                </Button>
                            </Grid>

                            {is_TaiGer_Admin(user) ? (
                                <Grid item>
                                    <Button
                                        color="error"
                                        onClick={() =>
                                            props.setDeleteProgramWarningOpen(
                                                true
                                            )
                                        }
                                        variant="outlined"
                                    >
                                        {t('Delete', { ns: 'common' })}
                                    </Button>
                                </Grid>
                            ) : null}
                        </Grid>
                    ) : null}
                    <Box sx={{ my: 2 }}>
                        <Link
                            component={LinkDom}
                            target="_blank"
                            to={`https://www.google.com/search?q=${props.program.school?.replace(
                                '&',
                                'and'
                            )}+${props.program.program_name?.replace('&', 'and')}+${
                                props.program.degree
                            }`}
                        >
                            <Button
                                color="primary"
                                endIcon={<OpenInNewIcon />}
                                fullWidth
                                variant="contained"
                            >
                                {t('Find in Google', { ns: 'programList' })}
                            </Button>
                        </Link>
                    </Box>
                    {is_TaiGer_role(user) ? (
                        <>
                            <Card className="card-with-scroll" sx={{ p: 2 }}>
                                <div className="card-scrollable-body">
                                    <Tabs
                                        aria-label="basic tabs example"
                                        onChange={handleStudentsTabChange}
                                        scrollButtons="auto"
                                        value={studentsTabValue}
                                        variant="scrollable"
                                    >
                                        <Tab
                                            label="In Progress"
                                            {...a11yProps(value, 0)}
                                        />
                                        <Tab
                                            label="Closed"
                                            {...a11yProps(value, 1)}
                                        />
                                    </Tabs>
                                    <CustomTabPanel
                                        index={0}
                                        value={studentsTabValue}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        {t('Name', {
                                                            ns: 'common'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('Agent', {
                                                            ns: 'common'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('Editor', {
                                                            ns: 'common'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {props.students
                                                    ?.filter((student) =>
                                                        isApplicationOpen(
                                                            student.application
                                                        )
                                                    )

                                                    .map((student, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Link
                                                                    component={
                                                                        LinkDom
                                                                    }
                                                                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                                        student._id?.toString(),
                                                                        DEMO.PROFILE_HASH
                                                                    )}`}
                                                                >
                                                                    {
                                                                        student.firstname
                                                                    }{' '}
                                                                    {
                                                                        student.lastname
                                                                    }
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {student.agents?.map(
                                                                    (agent) => (
                                                                        <Link
                                                                            component={
                                                                                LinkDom
                                                                            }
                                                                            key={
                                                                                agent._id
                                                                            }
                                                                            sx={{
                                                                                mr: 1
                                                                            }}
                                                                            to={`${DEMO.TEAM_AGENT_LINK(
                                                                                agent._id?.toString()
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                agent.firstname
                                                                            }
                                                                        </Link>
                                                                    )
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {student.editors?.map(
                                                                    (
                                                                        editor
                                                                    ) => (
                                                                        <Link
                                                                            component={
                                                                                LinkDom
                                                                            }
                                                                            key={
                                                                                editor._id
                                                                            }
                                                                            sx={{
                                                                                mr: 1
                                                                            }}
                                                                            to={`${DEMO.TEAM_EDITOR_LINK(
                                                                                editor._id?.toString()
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                editor.firstname
                                                                            }
                                                                        </Link>
                                                                    )
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </CustomTabPanel>
                                    <CustomTabPanel
                                        index={1}
                                        value={studentsTabValue}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        {t('Name', {
                                                            ns: 'common'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('Year', {
                                                            ns: 'common'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('Admission', {
                                                            ns: 'admissions'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {props.students
                                                    ?.filter(
                                                        (student) =>
                                                            !isApplicationOpen(
                                                                student.application
                                                            )
                                                    )

                                                    .map((student, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Link
                                                                    component={
                                                                        LinkDom
                                                                    }
                                                                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                                        student._id?.toString(),
                                                                        DEMO.PROFILE_HASH
                                                                    )}`}
                                                                >
                                                                    {
                                                                        student.firstname
                                                                    }{' '}
                                                                    {
                                                                        student.lastname
                                                                    }
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {student.application_preference
                                                                    ? student
                                                                          .application_preference
                                                                          .expected_application_date
                                                                    : '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {isProgramWithdraw(
                                                                    student.application
                                                                )
                                                                    ? 'WITHDREW'
                                                                    : student
                                                                          .application
                                                                          .admission}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                        <Typography
                                            sx={{ mt: 2 }}
                                            variant="string"
                                        >
                                            O: admitted, X: rejected, -: not
                                            confirmed{' '}
                                        </Typography>
                                    </CustomTabPanel>
                                </div>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography>
                                        {appConfig.companyName}{' '}
                                        {t('Program Assistant', {
                                            ns: 'programList'
                                        })}
                                    </Typography>
                                    <Button
                                        color="primary"
                                        onClick={props.programListAssistant}
                                        size="small"
                                        variant="contained"
                                    >
                                        {t('Fetch', { ns: 'common' })}
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    ) : null}
                    <Card className="card-with-scroll">
                        <CardContent className="card-scrollable-body">
                            <Typography>
                                {t('Provide Feedback', { ns: 'programList' })}
                            </Typography>
                            <ProgramReport
                                program_id={props.program._id?.toString()}
                                program_name={props.program.program_name}
                                uni_name={props.program.school}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};
export default SingleProgramView;
