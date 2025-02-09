import React from 'react';
import { Navigate } from 'react-router-dom';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';
import { useTranslation } from 'react-i18next';

const AllArchivStudents = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const {
        data: { data: initStudents }
    } = useLoaderData();

    const {
        res_modal_status,
        res_modal_message,
        ConfirmError,
        students,
        submitUpdateAgentlist,
        submitUpdateEditorlist,
        submitUpdateAttributeslist,
        updateStudentArchivStatus
    } = useStudents({
        students: initStudents
    });

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(t('All Archived Students', { ns: 'common' }));

    return (
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
                <Typography color="text.primary">
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('All Archived Students', { ns: 'common' })}
                    {` (${students.length})`}
                </Typography>
            </Breadcrumbs>
            <Box sx={{ mt: 2 }}>
                <TabStudBackgroundDashboard
                    students={students?.filter((student) => student.archiv)}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                />
            </Box>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
        </Box>
    );
};

export default AllArchivStudents;
