import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getArchivStudents, updateArchivStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const ArchivStudents = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { user_id } = useParams();
    const [archivStudentsState, setArchivStudentsState] = useState({
        error: '',
        isLoaded: false,
        students: [],
        success: false,
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });

    useEffect(() => {
        const TaiGerStaffId = user_id || user._id.toString();
        getArchivStudents(TaiGerStaffId).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setArchivStudentsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setArchivStudentsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setArchivStudentsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, [archivStudentsState.isLoaded]);

    const updateStudentArchivStatus = (studentId, isArchived) => {
        updateArchivStudents(studentId, isArchived).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setArchivStudentsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setArchivStudentsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setArchivStudentsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const ConfirmError = () => {
        setArchivStudentsState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Archiv Student');
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
        archivStudentsState;

    if (!isLoaded && !archivStudentsState.data) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    if (archivStudentsState.success) {
        return (
            <Box data-testid="archiv_student_component">
                <BreadcrumbsNavigation
                    items={[
                        {
                            label: appConfig.companyName,
                            link: DEMO.DASHBOARD_LINK
                        },
                        {
                            label: `${t('My Archived Students', { ns: 'common' })} (${archivStudentsState.students.length})`
                        }
                    ]}
                />
                {res_modal_status >= 400 ? (
                    <ModalMain
                        ConfirmError={ConfirmError}
                        res_modal_message={res_modal_message}
                        res_modal_status={res_modal_status}
                    />
                ) : null}
                <Box sx={{ mt: 2 }}>
                    <TabStudBackgroundDashboard
                        students={archivStudentsState.students}
                        updateStudentArchivStatus={updateStudentArchivStatus}
                    />
                </Box>
            </Box>
        );
    }
};

export default ArchivStudents;
