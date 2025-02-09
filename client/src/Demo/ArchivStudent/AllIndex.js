import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useTranslation } from 'react-i18next';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

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
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('All Students', { ns: 'common' }),
                        link: DEMO.DASHBOARD_LINK
                    },
                    {
                        label: `${t('All Archived Students', { ns: 'common' })} (${students.length})`
                    }
                ]}
            />
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
