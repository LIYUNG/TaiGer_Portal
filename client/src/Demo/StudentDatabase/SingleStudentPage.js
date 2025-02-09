import React, { useState } from 'react';
import {
    Navigate,
    Link as LinkDom,
    useLoaderData,
    useLocation
} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {
    Tabs,
    Tab,
    Box,
    Button,
    Card,
    Link,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Breadcrumbs,
    Alert,
    TableContainer,
    IconButton,
    ListItem,
    Grid,
    Badge
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {
    is_TaiGer_Editor,
    is_TaiGer_role,
    isProgramDecided
} from '@taiger-common/core';

import { TopBar } from '../../components/TopBar/TopBar';
import BaseDocumentStudentView from '../BaseDocuments/BaseDocumentStudentView';
import EditorDocsProgress from '../CVMLRLCenter/EditorDocsProgress';
import UniAssistListCard from '../UniAssist/UniAssistListCard';
import SurveyComponent from '../Survey/SurveyComponent';
import Notes from '../Notes/index';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentDashboard from '../Dashboard/StudentDashboard/StudentDashboard';
import {
    convertDate,
    programstatuslist,
    SINGLE_STUDENT_TABS,
    SINGLE_STUDENT_REVERSED_TABS,
    TENFOLD_AI_DOMAIN
} from '../../utils/contants';
import {
    needGraduatedApplicantsButStudentNotGraduated,
    needGraduatedApplicantsPrograms
} from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
    updateAgents,
    updateArchivStudents,
    updateAttributes,
    updateEditors
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import PortalCredentialPage from '../PortalCredentialPage';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { SurveyProvider } from '../../components/SurveyProvider';
import ProgramDetailsComparisonTable from '../Program/ProgramDetailsComparisonTable';
import StudentBriefOverview from '../Dashboard/MainViewTab/StudentBriefOverview/StudentBriefOverview';
import ProgramLanguageNotMatchedBanner from '../../components/Banner/ProgramLanguageNotMatchedBanner';
import Audit from '../Audit';
import EnglishCertificateExpiredBeforeDeadlineBanner from '../../components/Banner/EnglishCertificateExpiredBeforeDeadlineBanner';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

export const SingleStudentPageMainContent = ({
    survey_link,
    base_docs_link,
    data,
    audit
}) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [singleStudentPage, setSingleStudentPage] = useState({
        error: '',
        isLoaded: {},
        isLoaded2: false,
        taiger_view: true,
        detailedView: false,
        student: data,
        base_docs_link: base_docs_link,
        survey_link: survey_link.find((link) => link.key === 'Grading_System')
            .link,
        success: false,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    const { hash } = useLocation();
    const [value, setValue] = useState(
        SINGLE_STUDENT_TABS[hash.replace('#', '')] || 0
    );
    const handleChange = (event, newValue) => {
        setValue(newValue);
        window.location.hash = SINGLE_STUDENT_REVERSED_TABS[newValue];
    };

    const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
        e.preventDefault();
        UpdateAgentlist(e, updateAgentList, student_id);
    };

    const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
        e.preventDefault();
        UpdateEditorlist(e, updateEditorList, student_id);
    };

    const submitUpdateAttributeslist = (e, updateEditorList, student_id) => {
        e.preventDefault();
        UpdateAttributeslist(e, updateEditorList, student_id);
    };

    const UpdateAgentlist = (e, updateAgentList, student_id) => {
        e.preventDefault();
        updateAgents(updateAgentList, student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    var students_temp = { ...singleStudentPage.student };
                    students_temp.agents = data.agents; // datda is single student updated
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        student: students_temp,
                        success: success,
                        updateAgentList: [],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSingleStudentPage((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const UpdateEditorlist = (e, updateEditorList, student_id) => {
        e.preventDefault();
        updateEditors(updateEditorList, student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    var students_temp = { ...singleStudentPage.student };
                    students_temp.editors = data.editors; // datda is single student updated
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        student: students_temp,
                        success: success,
                        updateAgentList: [],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSingleStudentPage((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const UpdateAttributeslist = (e, updateAttributesList, student_id) => {
        e.preventDefault();
        updateAttributes(updateAttributesList, student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    var students_temp = { ...singleStudentPage.student };
                    students_temp.attributes = data.attributes; // datda is single student updated
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        student: students_temp,
                        success: success,
                        updateAgentList: [],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSingleStudentPage((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const updateStudentArchivStatus = (studentId, isArchived, shouldInform) => {
        updateArchivStudents(studentId, isArchived, shouldInform).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    let student_temp = { ...singleStudentPage.student };
                    student_temp.archiv = isArchived;
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        student: student_temp,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSingleStudentPage((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setSingleStudentPage((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const onChangeView = () => {
        setSingleStudentPage((prevState) => ({
            ...prevState,
            taiger_view: !singleStudentPage.taiger_view
        }));
    };

    const onChangeProgramsDetailView = () => {
        setSingleStudentPage((prevState) => ({
            ...prevState,
            detailedView: !prevState.detailedView
        }));
    };
    const ConfirmError = () => {
        setSingleStudentPage((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const { res_modal_status, res_modal_message } = singleStudentPage;

    TabTitle(
        `Student ${singleStudentPage.student.firstname} ${singleStudentPage.student.lastname} | ${singleStudentPage.student.firstname_chinese} ${singleStudentPage.student.lastname_chinese}`
    );
    return (
        <>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
            >
                <Box>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.DASHBOARD_LINK}`}
                            underline="hover"
                        >
                            {appConfig.companyName}
                        </Link>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_LINK}`}
                            underline="hover"
                        >
                            {t('Students Database', { ns: 'common' })}
                        </Link>
                        <Typography color="text.primary">
                            {t('Student', { ns: 'common' })}{' '}
                            {singleStudentPage.student.firstname}
                            {' ,'}
                            {singleStudentPage.student.lastname}
                            {' | '}
                            {singleStudentPage.student.lastname_chinese}
                            {singleStudentPage.student.firstname_chinese}
                        </Typography>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.PROFILE_STUDENT_LINK(singleStudentPage.student._id)}`}
                            underline="hover"
                        >
                            <IconButton>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box>
                    <Box style={{ textAlign: 'left' }}>
                        <Typography style={{ float: 'right' }}>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                sx={{ mr: 1 }}
                                to={`${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(
                                    singleStudentPage.student._id
                                )}`}
                                underline="hover"
                            >
                                <Button
                                    color="primary"
                                    size="small"
                                    startIcon={<ChatBubbleOutlineIcon />}
                                    variant="contained"
                                >
                                    <b>{t('Message', { ns: 'common' })}</b>
                                </Button>
                            </Link>
                            {t('Last Login', { ns: 'auth' })}:&nbsp;
                            {convertDate(
                                singleStudentPage.student.lastLoginAt
                            )}{' '}
                            <Button
                                color="secondary"
                                onClick={onChangeView}
                                size="small"
                                variant="contained"
                            >
                                {t('Switch View', { ns: 'common' })}
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {singleStudentPage.student.archiv ? <TopBar /> : null}
            {singleStudentPage.taiger_view ? (
                <>
                    {needGraduatedApplicantsButStudentNotGraduated(
                        singleStudentPage.student
                    ) ? (
                        <Card sx={{ border: '4px solid red', borderRadius: 2 }}>
                            <Alert severity="warning">
                                {t(
                                    'Programs below are only for graduated applicants',
                                    {
                                        ns: 'common'
                                    }
                                )}
                                &nbsp;:&nbsp;
                            </Alert>
                            {needGraduatedApplicantsPrograms(
                                singleStudentPage.student.applications
                            )?.map((app) => (
                                <ListItem key={app.programId._id.toString()}>
                                    <Link
                                        component={LinkDom}
                                        target="_blank"
                                        to={DEMO.SINGLE_PROGRAM_LINK(
                                            app.programId._id.toString()
                                        )}
                                    >
                                        {app.programId.school}{' '}
                                        {app.programId.program_name}{' '}
                                        {app.programId.degree}{' '}
                                        {app.programId.semester}
                                    </Link>
                                </ListItem>
                            ))}
                        </Card>
                    ) : null}
                    <Grid container spacing={0} sx={{ mt: 0 }}>
                        <Grid item md={12} xs={12}>
                            <ProgramLanguageNotMatchedBanner
                                student={singleStudentPage.student}
                            />
                        </Grid>
                        <EnglishCertificateExpiredBeforeDeadlineBanner
                            student={singleStudentPage.student}
                        />
                    </Grid>
                    <Box
                        sx={{
                            my: 1,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2
                        }}
                    >
                        <StudentBriefOverview
                            student={singleStudentPage.student}
                            submitUpdateAgentlist={submitUpdateAgentlist}
                            submitUpdateAttributeslist={
                                submitUpdateAttributeslist
                            }
                            submitUpdateEditorlist={submitUpdateEditorlist}
                            updateStudentArchivStatus={
                                updateStudentArchivStatus
                            }
                        />
                    </Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            aria-label="basic tabs example"
                            indicatorColor="primary"
                            onChange={handleChange}
                            scrollButtons="auto"
                            value={value}
                            variant="scrollable"
                        >
                            <Tab
                                label={t('Applications Overview', {
                                    ns: 'common'
                                })}
                                {...a11yProps(value, 0)}
                            />
                            <Tab
                                label={t('Documents', { ns: 'common' })}
                                {...a11yProps(value, 1)}
                            />
                            <Tab
                                label={t('CV ML RL', { ns: 'common' })}
                                {...a11yProps(value, 2)}
                            />
                            <Tab
                                label={t('Portal', { ns: 'common' })}
                                {...a11yProps(value, 3)}
                            />
                            <Tab
                                label={t('Uni-Assist', { ns: 'common' })}
                                {...a11yProps(value, 4)}
                            />
                            <Tab
                                label={t('Profile', { ns: 'common' })}
                                {...a11yProps(value, 5)}
                            />
                            <Tab
                                label={t('My Courses', { ns: 'common' })}
                                {...a11yProps(value, 6)}
                            />
                            <Tab
                                label={t('Notes', { ns: 'common' })}
                                {...a11yProps(value, 7)}
                            />
                            <Tab
                                label={t('Audit', { ns: 'common' })}
                                {...a11yProps(value, 8)}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel index={0} value={value}>
                        <Box>
                            <Button
                                color="secondary"
                                onClick={onChangeProgramsDetailView}
                                variant="contained"
                            >
                                {singleStudentPage.detailedView
                                    ? t('Simple View', { ns: 'common' })
                                    : t('Details View', { ns: 'common' })}
                            </Button>
                            <Badge badgeContent="new" color="error">
                                <Button
                                    color="primary"
                                    component={LinkDom}
                                    sx={{ mx: 1 }}
                                    target="_blank"
                                    to={`${TENFOLD_AI_DOMAIN}/${singleStudentPage.student._id}`}
                                    variant="contained"
                                >
                                    {t('Program Recommender', { ns: 'common' })}
                                </Button>
                            </Badge>
                            {!is_TaiGer_Editor(user) ? (
                                <Link
                                    component={LinkDom}
                                    sx={{ mr: 1 }}
                                    target="_blank"
                                    to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                                        singleStudentPage.student._id
                                    )}`}
                                    underline="hover"
                                >
                                    <Button
                                        color="secondary"
                                        startIcon={<EditIcon />}
                                        variant="contained"
                                    >
                                        {t('Edit', { ns: 'common' })}
                                    </Button>
                                </Link>
                            ) : null}
                            <Typography variant="body1">
                                Applications (Selected / Decided / Contract):{' '}
                                {singleStudentPage.student
                                    .applying_program_count ? (
                                    <>
                                        {
                                            singleStudentPage.student
                                                .applications.length
                                        }{' '}
                                        /{' '}
                                        {
                                            singleStudentPage.student.applications?.filter(
                                                (app) => isProgramDecided(app)
                                            )?.length
                                        }{' '}
                                        /{' '}
                                        {
                                            singleStudentPage.student
                                                .applying_program_count
                                        }
                                    </>
                                ) : (
                                    <b className="text-danger">0</b>
                                )}
                            </Typography>
                        </Box>
                        {singleStudentPage.detailedView ? (
                            <ProgramDetailsComparisonTable
                                applications={
                                    singleStudentPage.student?.applications
                                }
                            />
                        ) : (
                            <TableContainer style={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {programstatuslist.map(
                                                (doc, index) => (
                                                    <TableCell key={index}>
                                                        {doc.name}
                                                    </TableCell>
                                                )
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <ApplicationProgress
                                            student={singleStudentPage.student}
                                        />
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CustomTabPanel>
                    <CustomTabPanel index={1} value={value}>
                        <BaseDocumentStudentView
                            base_docs_link={base_docs_link}
                            student={singleStudentPage.student}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel index={2} value={value}>
                        <Card sx={{ p: 2 }}>
                            <EditorDocsProgress
                                idx={0}
                                student={singleStudentPage.student}
                            />
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={3} value={value}>
                        <Card>
                            <PortalCredentialPage
                                showTitle={true}
                                student_id={singleStudentPage.student._id.toString()}
                            />
                        </Card>
                    </CustomTabPanel>
                    <CustomTabPanel index={4} value={value}>
                        <UniAssistListCard
                            student={singleStudentPage.student}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel index={5} value={value}>
                        <SurveyProvider
                            value={{
                                academic_background:
                                    singleStudentPage.student
                                        .academic_background,
                                application_preference:
                                    singleStudentPage.student
                                        .application_preference,
                                survey_link: singleStudentPage.survey_link,
                                student_id:
                                    singleStudentPage.student._id.toString()
                            }}
                        >
                            <SurveyComponent
                                updateconfirmed={
                                    singleStudentPage.updateconfirmed
                                }
                            />
                        </SurveyProvider>
                    </CustomTabPanel>
                    <CustomTabPanel index={6} value={value}>
                        <Link
                            component={LinkDom}
                            rel="noopener noreferrer"
                            target="_blank"
                            to={`${DEMO.COURSES_INPUT_LINK(
                                singleStudentPage.student._id.toString()
                            )}`}
                            underline="hover"
                        >
                            <Button color="primary" variant="contained">
                                Go to My Courses{' '}
                            </Button>
                        </Link>
                    </CustomTabPanel>
                    <CustomTabPanel index={7} value={value}>
                        <Typography fontWeight="bold">
                            This is internal notes. Student won&apos;t see this
                            note.
                        </Typography>
                        <br />
                        <Notes
                            student_id={singleStudentPage.student._id.toString()}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel index={8} value={value}>
                        <Audit audit={audit} />
                    </CustomTabPanel>
                </>
            ) : (
                <>
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography fontWeight="bold" variant="body1">
                            {t('Student View', { ns: 'common' })}
                        </Typography>
                    </Alert>
                    <StudentDashboard
                        ReadOnlyMode={true}
                        student={singleStudentPage.student}
                    />
                </>
            )}
        </>
    );
};

const SingleStudentPage = () => {
    const {
        data: { survey_link, base_docs_link, data, audit }
    } = useLoaderData();
    return (
        <SingleStudentPageMainContent
            audit={audit}
            base_docs_link={base_docs_link}
            data={data}
            survey_link={survey_link}
        />
    );
};
export default SingleStudentPage;
