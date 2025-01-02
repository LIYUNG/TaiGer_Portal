import React from 'react';
import {
    Box,
    Breadcrumbs,
    Link,
    SpeedDial,
    SpeedDialAction,
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
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ExternalMainView from './ExternalDashboard/ExternalMainView';

const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' }
];

function DashboardBody({ studentAndEssays }) {
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
            {res_modal_status >= 400 && (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_status={res_modal_status}
                    res_modal_message={res_modal_message}
                />
            )}
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('Dashboard', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            {is_TaiGer_Admin(user) && (
                <AdminMainView
                    students={students}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                    essayDocumentThreads={essayDocumentThreads}
                    auditLog={auditLog}
                />
            )}
            {is_TaiGer_Manager(user) && (
                <ManagerMainView
                    students={students}
                    notification={notification}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                    onUpdateProfileFilefromstudent={
                        onUpdateProfileFilefromstudent
                    }
                />
            )}
            {is_TaiGer_Agent(user) && (
                <AgentMainView
                    students={students}
                    notification={notification}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                    onUpdateProfileFilefromstudent={
                        onUpdateProfileFilefromstudent
                    }
                />
            )}
            {is_TaiGer_Editor(user) && (
                <EditorMainView
                    students={students}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    essayDocumentThreads={essayDocumentThreads}
                />
            )}
            {is_TaiGer_External(user) && (
                <ExternalMainView
                    students={students}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    essayDocumentThreads={essayDocumentThreads}
                />
            )}
            {is_TaiGer_Student(user) && (
                <StudentDashboard
                    isCoursesFilled={isCoursesFilled}
                    student={students[0]}
                />
            )}
            {is_TaiGer_Guest(user) && <GuestDashboard students={students} />}
            {false && (
                <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        icon={<SpeedDialIcon />}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                            />
                        ))}
                    </SpeedDial>
                </Box>
            )}
        </Box>
    );
}

export default DashboardBody;
