import React, { useEffect, useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Card, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useTranslation } from 'react-i18next';

import CVMLRLOverview from '../CVMLRLCenter/CVMLRLOverview';
import ErrorPage from '../Utils/ErrorPage';
import { getCVMLRLOverview, putThreadFavorite } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
    AGENT_SUPPORT_DOCUMENTS_A,
    open_tasks,
    toogleItemInArray
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import {
    is_my_fav_message_status,
    is_new_message_status,
    is_pending_status
} from '../../utils/contants';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const AgentSupportDocuments = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [indexState, setIndexState] = useState({
        error: '',
        isLoaded: false,
        data: null,
        success: false,
        students: null,
        doc_thread_id: '',
        student_id: '',
        program_id: '',
        SetAsFinalFileModel: false,
        isFinalVersion: false,
        status: '', //reject, accept... etc
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        getCVMLRLOverview().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        open_tasks_arr: open_tasks(data).filter((open_task) =>
                            [...AGENT_SUPPORT_DOCUMENTS_A].includes(
                                open_task.file_type
                            )
                        ),
                        success: success,
                        res_status: status
                    }));
                } else {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    const handleFavoriteToggle = (id) => {
        const updatedOpenTasksArr = indexState.open_tasks_arr?.map((row) =>
            row.id === id
                ? {
                      ...row,
                      flag_by_user_id: toogleItemInArray(
                          row.flag_by_user_id,
                          user._id.toString()
                      )
                  }
                : row
        );
        setIndexState((prevState) => ({
            ...prevState,
            open_tasks_arr: updatedOpenTasksArr
        }));
        putThreadFavorite(id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (!success) {
                    setIndexState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexState((prevState) => ({
                    ...prevState,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const { res_status, isLoaded, open_tasks_arr } = indexState;
    TabTitle(t('Agent Support Documents', { ns: 'common' }), { ns: 'common' });
    if (!isLoaded && !indexState.students) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const new_message_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            is_new_message_status(user, open_task)
    );

    const fav_message_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show && is_my_fav_message_status(user, open_task)
    );

    const followup_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id !== ''
    );

    const pending_progress_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id === ''
    );

    const closed_tasks = open_tasks_arr.filter(
        (open_task) => open_task.show && open_task.isFinalVersion
    );

    return (
        <Box data-testid="cvmlrlcenter_component">
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('My Students', { ns: 'common' }),
                        link: DEMO.DASHBOARD_LINK
                    },
                    {
                        label: t('Agent Support Documents', { ns: 'common' })
                    }
                ]}
            />
            {!is_TaiGer_role(user) ? (
                <Card sx={{ p: 2 }}>
                    <Typography variant="body1">Instructions</Typography>
                    若您為初次使用，可能無任何
                    Tasks。請聯絡您的顧問處理選校等，方能開始準備文件。
                    <br />
                    在此之前可以詳閱，了解之後與Editor之間的互動模式：
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={`${DEMO.CV_ML_RL_DOCS_LINK}`}
                    >
                        <b>Click me</b>
                    </Link>
                </Card>
            ) : null}
            <CVMLRLOverview
                closed_tasks={closed_tasks}
                fav_message_tasks={fav_message_tasks}
                followup_tasks={followup_tasks}
                handleFavoriteToggle={handleFavoriteToggle}
                isLoaded={indexState.isLoaded}
                new_message_tasks={new_message_tasks}
                pending_progress_tasks={pending_progress_tasks}
                students={indexState.students}
                success={indexState.success}
            />
        </Box>
    );
};

export default AgentSupportDocuments;
