import React from 'react';
import {
    Box,
    Breadcrumbs,
    Link,
    // SpeedDial,
    // SpeedDialAction,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    is_TaiGer_Admin,
    is_TaiGer_Agent,
    is_TaiGer_Editor,
    is_TaiGer_External,
    is_TaiGer_Guest,
    is_TaiGer_Manager,
    is_TaiGer_Student
} from '@taiger-common/core';

import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import ManagerMainView from './ManagerDashboard/ManagerMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestDashboard from './GuestDashboard/GuestDashboard';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
import ExternalMainView from './ExternalDashboard/ExternalMainView';

// const actions = [
//     { icon: <FileCopyIcon />, name: 'Copy' },
//     { icon: <SaveIcon />, name: 'Save' },
//     { icon: <PrintIcon />, name: 'Print' },
//     { icon: <ShareIcon />, name: 'Share' }
// ];

const DashboardBody = ({ studentAndEssays }) => {
    const { user } = useAuth();
    const {
        data: {
            data: fetchedStudents,
            isCoursesFilled,
            notification,
            auditLog
        },
        essays: { data: essayDocumentThreads }
    } = studentAndEssays;

    const { t } = useTranslation();
    const {
        students,
        res_modal_message,
        res_modal_status,
        submitUpdateAgentlist,
        submitUpdateEditorlist,
        submitUpdateAttributeslist,
        updateStudentArchivStatus,
        onUpdateProfileFilefromstudent,
        ConfirmError
    } = useStudents({
        students: fetchedStudents,
        isCoursesFilled,
        notification
    });

    TabTitle('Home Page');

    return (
        <Box>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('Dashboard', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            {is_TaiGer_Admin(user) ? (
                <AdminMainView
                    auditLog={auditLog}
                    essayDocumentThreads={essayDocumentThreads}
                    students={students}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                />
            ) : null}
            {is_TaiGer_Manager(user) ? (
                <ManagerMainView
                    notification={notification}
                    onUpdateProfileFilefromstudent={
                        onUpdateProfileFilefromstudent
                    }
                    students={students}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                />
            ) : null}
            {is_TaiGer_Agent(user) ? (
                <AgentMainView
                    notification={notification}
                    onUpdateProfileFilefromstudent={
                        onUpdateProfileFilefromstudent
                    }
                    students={students}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                />
            ) : null}
            {is_TaiGer_Editor(user) ? (
                <EditorMainView
                    essayDocumentThreads={essayDocumentThreads}
                    students={students}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                />
            ) : null}
            {is_TaiGer_External(user) ? (
                <ExternalMainView
                    essayDocumentThreads={essayDocumentThreads}
                    students={students}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                />
            ) : null}
            {is_TaiGer_Student(user) ? (
                <StudentDashboard
                    isCoursesFilled={isCoursesFilled}
                    student={students[0]}
                />
            ) : null}
            {is_TaiGer_Guest(user) ? (
                <GuestDashboard students={students} />
            ) : null}
            {/* {false ? (
                <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        icon={<SpeedDialIcon />}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                icon={action.icon}
                                key={action.name}
                                tooltipTitle={action.name}
                            />
                        ))}
                    </SpeedDial>
                </Box>
            ) : null} */}
        </Box>
    );
};

export default DashboardBody;
